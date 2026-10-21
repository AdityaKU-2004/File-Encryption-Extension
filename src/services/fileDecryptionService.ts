/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileDecryptionRequest, FileDecryptionResult } from '../types/encryption';
import { FileMetadataPayload } from '../types/file';
import { sanitizeFilename } from '../utils/filename';
import {
  HEADER_SIZE,
  parseContainerHeader,
  quickValidateContainerHeader,
} from './encryptedFileFormat';
import { isWebCryptoAvailable } from './fileEncryptionService';

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
 * Decrypts a SecureVault (.svault) encrypted file using AES-256-GCM and PBKDF2.
 * Authenticates container integrity and restores original bytes byte-for-byte.
 */
export async function decryptFile(
  request: FileDecryptionRequest
): Promise<FileDecryptionResult> {
  const startTime = performance.now();
  const { file, password, onProgress, signal } = request;

  if (!isWebCryptoAvailable()) {
    return {
      success: false,
      originalFilename: '',
      originalMimeType: '',
      originalSize: 0,
      executionTimeMs: 0,
      error: 'Web Crypto API is not accessible in this environment.',
    };
  }

  // 1. Fast preliminary header check
  const quickCheck = await quickValidateContainerHeader(file);
  if (!quickCheck.isValid) {
    return {
      success: false,
      originalFilename: '',
      originalMimeType: '',
      originalSize: 0,
      executionTimeMs: 0,
      error: quickCheck.error || 'File is not a valid SecureVault encrypted container.',
    };
  }

  if (signal?.aborted) {
    return {
      success: false,
      originalFilename: '',
      originalMimeType: '',
      originalSize: 0,
      executionTimeMs: 0,
      error: 'Operation cancelled by user.',
    };
  }

  try {
    onProgress?.(0, file.size);

    // 2. Read container buffer
    const fileBuffer = await file.arrayBuffer();

    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.');
    }

    onProgress?.(Math.floor(file.size * 0.2), file.size);

    // 3. Parse container binary header
    const header = parseContainerHeader(fileBuffer);
    if (!header.isValid) {
      throw new Error(header.error || 'Malformed container header.');
    }

    // 4. Derive AES-GCM 256-bit key with container's salt and iterations
    const aesKey = await deriveKeyFromPassword(password, header.salt, header.iterations);

    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.');
    }

    onProgress?.(Math.floor(file.size * 0.4), file.size);

    // 5. Decrypt and authenticate metadata payload
    const metadataSlice = fileBuffer.slice(header.metadataOffset, header.payloadOffset);

    let metadata: FileMetadataPayload;
    try {
      const decryptedMetadataBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: header.metadataIv as unknown as BufferSource,
        },
        aesKey,
        metadataSlice as unknown as BufferSource
      );

      const metadataJson = new TextDecoder().decode(decryptedMetadataBuffer);
      metadata = JSON.parse(metadataJson) as FileMetadataPayload;
    } catch {
      // If AES-GCM tag check fails, throw standard authentication error without leaking data
      throw new Error(
        'Decryption failed. The password may be incorrect, or the file may be corrupted or incompatible.'
      );
    }

    if (signal?.aborted) {
      throw new Error('Operation cancelled by user.');
    }

    onProgress?.(Math.floor(file.size * 0.6), file.size);

    // 6. Decrypt and authenticate file payload
    const payloadSlice = fileBuffer.slice(header.payloadOffset);

    let decryptedPayloadBuffer: ArrayBuffer;
    try {
      decryptedPayloadBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: header.payloadIv as unknown as BufferSource,
        },
        aesKey,
        payloadSlice as unknown as BufferSource
      );
    } catch {
      throw new Error(
        'Payload authentication failed. The file content may be corrupted or truncated.'
      );
    }

    onProgress?.(file.size, file.size);

    // 7. Sanitize original filename
    const safeFilename = sanitizeFilename(metadata.originalName, 'recovered_file');

    // 8. Create restored binary Blob preserving byte-for-byte original data
    const recoveredBlob = new Blob([decryptedPayloadBuffer], {
      type: metadata.originalMimeType || 'application/octet-stream',
    });

    const duration = Math.round(performance.now() - startTime);

    return {
      success: true,
      decryptedBlob: recoveredBlob,
      originalFilename: safeFilename,
      originalMimeType: metadata.originalMimeType || 'application/octet-stream',
      originalSize: metadata.originalSize || recoveredBlob.size,
      executionTimeMs: duration,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      originalFilename: '',
      originalMimeType: '',
      originalSize: 0,
      executionTimeMs: duration,
      error:
        err instanceof Error
          ? err.message
          : 'Decryption failed. The password may be incorrect, or the file may be corrupted or incompatible.',
    };
  }
}
