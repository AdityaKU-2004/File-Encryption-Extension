/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_CRYPTO_CONFIG, FORMAT_VERSION } from '../config/encryptionConfig';
import { FileEncryptionRequest, FileEncryptionResult } from '../types/encryption';
import { FileMetadataPayload } from '../types/file';
import { getEncryptedFilename } from '../utils/filename';
import { buildContainerHeader } from './encryptedFileFormat';

/**
 * Checks if the Web Crypto API is available in the browser.
 */
export function isWebCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey from a user password and salt using PBKDF2-HMAC-SHA256.
 */
async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const subtle = window.crypto.subtle;
  const passwordBytes = new TextEncoder().encode(password);

  const baseKey = await subtle.importKey(
    'raw',
    passwordBytes as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts an arbitrary binary file using native Web Crypto AES-256-GCM and PBKDF2.
 * Produces a versioned .svault container file with authenticated metadata.
 */
export async function encryptFile(
  request: FileEncryptionRequest
): Promise<FileEncryptionResult> {
  const startTime = performance.now();
  const { file, password, iterations = DEFAULT_CRYPTO_CONFIG.iterations, onProgress, signal } = request;

  const encryptedFilename = getEncryptedFilename(file.name);

  if (!isWebCryptoAvailable()) {
    return {
      success: false,
      encryptedFilename,
      originalSize: file.size,
      encryptedSize: 0,
      executionTimeMs: 0,
      error: 'Web Crypto API is not accessible in this environment.',
    };
  }

  if (signal?.aborted) {
    return {
      success: false,
      encryptedFilename,
      originalSize: file.size,
      encryptedSize: 0,
      executionTimeMs: 0,
      error: 'Operation cancelled by user.',
    };
  }

  try {
    onProgress?.(0, file.size);

    // 1. Generate cryptographically random salt (16 bytes) and separate IVs for metadata & payload
    const salt = new Uint8Array(16);
    const metadataIv = new Uint8Array(12);
    const payloadIv = new Uint8Array(12);

    window.crypto.getRandomValues(salt);
    window.crypto.getRandomValues(metadataIv);
    window.crypto.getRandomValues(payloadIv);

    // 2. Derive AES-GCM 256-bit key using PBKDF2-HMAC-SHA256
    const aesKey = await deriveKeyFromPassword(password, salt, iterations);

    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.');
    }

    // 3. Encrypt metadata payload (JSON containing originalName, originalSize, MIME type, timestamp)
    const metadata: FileMetadataPayload = {
      originalName: file.name,
      originalSize: file.size,
      originalMimeType: file.type || 'application/octet-stream',
      encryptedAt: new Date().toISOString(),
    };

    const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));
    const encryptedMetadataBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: metadataIv as unknown as BufferSource,
      },
      aesKey,
      metadataBytes as unknown as BufferSource
    );

    const encryptedMetadataBytes = new Uint8Array(encryptedMetadataBuffer);

    // 4. Build binary container header
    const headerBytes = buildContainerHeader(
      FORMAT_VERSION,
      iterations,
      salt,
      metadataIv,
      payloadIv,
      encryptedMetadataBytes.byteLength
    );

    // 5. Read and encrypt the file payload
    // Report progress halfway through file read
    onProgress?.(Math.floor(file.size * 0.3), file.size);

    const fileBuffer = await file.arrayBuffer();

    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.');
    }

    onProgress?.(Math.floor(file.size * 0.6), file.size);

    const encryptedPayloadBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: payloadIv as unknown as BufferSource,
      },
      aesKey,
      fileBuffer as unknown as BufferSource
    );

    onProgress?.(file.size, file.size);

    // 6. Assemble the versioned .svault container Blob
    const containerBlob = new Blob(
      [headerBytes as unknown as BlobPart, encryptedMetadataBytes as unknown as BlobPart, encryptedPayloadBuffer],
      { type: 'application/x-securevault' }
    );

    const duration = Math.round(performance.now() - startTime);

    return {
      success: true,
      encryptedBlob: containerBlob,
      encryptedFilename,
      originalSize: file.size,
      encryptedSize: containerBlob.size,
      executionTimeMs: duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      encryptedFilename,
      originalSize: file.size,
      encryptedSize: 0,
      executionTimeMs: duration,
      error: err instanceof Error ? err.message : 'Encryption failed due to an unexpected cryptographic error.',
    };
  }
}
