/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_CRYPTO_CONFIG, ENVELOPE_PREFIX } from '../config/encryptionConfig';
import {
  DecryptionRequest,
  DecryptionResult,
  EncryptionRequest,
  EncryptionResult,
  SecureVaultEnvelope,
} from '../types/encryption';
import {
  base64ToUint8Array,
  stringToUtf8,
  uint8ArrayToBase64,
  utf8ToString,
} from '../utils/encoding';
import { validateAndParseEnvelope } from '../utils/validation';

/**
 * Checks if the Web Crypto API is available in the current environment.
 */
export function isWebCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey from a user password using PBKDF2-HMAC-SHA256.
 */
async function deriveAesKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const subtle = window.crypto.subtle;
  const passwordBytes = stringToUtf8(password);

  // 1. Import raw password as key material for PBKDF2
  const baseKey = await subtle.importKey(
    'raw',
    passwordBytes as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // 2. Derive AES-GCM 256-bit encryption key
  const derivedKey = await subtle.deriveKey(
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
    false, // Non-extractable for memory defense
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

/**
 * Encrypts plaintext locally using PBKDF2 + AES-256-GCM via the native Web Crypto API.
 */
export async function encryptWithWebCrypto(
  request: EncryptionRequest
): Promise<EncryptionResult> {
  const startTime = performance.now();

  if (!isWebCryptoAvailable()) {
    return {
      success: false,
      encryptedText: '',
      characterCount: 0,
      executionTimeMs: 0,
      error: 'Web Crypto API is not supported or accessible in this environment.',
    };
  }

  try {
    const { plaintext, password, iterations = DEFAULT_CRYPTO_CONFIG.iterations } = request;

    // 1. Generate cryptographically secure random salt (16 bytes / 128 bits)
    const salt = new Uint8Array(DEFAULT_CRYPTO_CONFIG.saltLength);
    window.crypto.getRandomValues(salt);

    // 2. Generate cryptographically secure random IV (12 bytes / 96 bits for AES-GCM)
    const iv = new Uint8Array(DEFAULT_CRYPTO_CONFIG.ivLength);
    window.crypto.getRandomValues(iv);

    // 3. Derive 256-bit AES-GCM key
    const aesKey = await deriveAesKey(password, salt, iterations);

    // 4. Encrypt the plaintext (AES-GCM includes 128-bit authentication tag appended to ciphertext)
    const plaintextBytes = stringToUtf8(plaintext);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      aesKey,
      plaintextBytes as unknown as BufferSource
    );

    const ciphertextBytes = new Uint8Array(encryptedBuffer);

    // 5. Construct SecureVault envelope
    const envelope: SecureVaultEnvelope = {
      format: 'SECUREVAULT',
      version: 1,
      algorithm: 'AES-256-GCM',
      kdf: 'PBKDF2-SHA256',
      iterations,
      salt: uint8ArrayToBase64(salt),
      iv: uint8ArrayToBase64(iv),
      ciphertext: uint8ArrayToBase64(ciphertextBytes),
      createdAt: new Date().toISOString(),
    };

    // 6. Encode into standard SecureVault formatted string
    const jsonEnvelope = JSON.stringify(envelope);
    const base64Envelope = btoa(jsonEnvelope);
    const formattedString = `${ENVELOPE_PREFIX}${base64Envelope}`;

    const duration = Math.round(performance.now() - startTime);

    return {
      success: true,
      encryptedText: formattedString,
      envelope,
      executionTimeMs: duration,
      characterCount: formattedString.length,
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      encryptedText: '',
      characterCount: 0,
      executionTimeMs: duration,
      error: err instanceof Error ? err.message : 'Encryption failed due to an unexpected cryptographic error.',
    };
  }
}

/**
 * Decrypts a SecureVault encrypted message using PBKDF2 + AES-256-GCM via the native Web Crypto API.
 */
export async function decryptWithWebCrypto(
  request: DecryptionRequest
): Promise<DecryptionResult> {
  const startTime = performance.now();

  if (!isWebCryptoAvailable()) {
    return {
      success: false,
      executionTimeMs: 0,
      error: 'Web Crypto API is not supported or accessible in this environment.',
    };
  }

  try {
    const { encryptedText, password } = request;

    // 1. Validate and parse the envelope
    const parseResult = validateAndParseEnvelope(encryptedText);
    if (!parseResult.isValid || !parseResult.envelope) {
      return {
        success: false,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: parseResult.error || 'Invalid or incompatible encrypted message format.',
      };
    }

    const envelope = parseResult.envelope;

    // 2. Decode salt, IV, and ciphertext from Base64
    const salt = base64ToUint8Array(envelope.salt);
    const iv = base64ToUint8Array(envelope.iv);
    const ciphertext = base64ToUint8Array(envelope.ciphertext);

    // 3. Derive AES-GCM key using PBKDF2 with envelope's salt and iteration count
    const aesKey = await deriveAesKey(password, salt, envelope.iterations);

    // 4. Decrypt via AES-GCM
    // If the authentication tag fails (wrong password or altered ciphertext),
    // subtle.decrypt will throw an OperationError
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      aesKey,
      ciphertext as unknown as BufferSource
    );

    const decryptedBytes = new Uint8Array(decryptedBuffer);
    const decryptedText = utf8ToString(decryptedBytes);
    const duration = Math.round(performance.now() - startTime);

    return {
      success: true,
      decryptedText,
      executionTimeMs: duration,
      envelopeMetadata: {
        algorithm: envelope.algorithm,
        iterations: envelope.iterations,
        createdAt: envelope.createdAt,
      },
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);

    // In AES-GCM, incorrect passwords cause an authentication tag mismatch
    const isAuthFailure =
      err instanceof DOMException &&
      (err.name === 'OperationError' || err.message.toLowerCase().includes('tag'));

    const errorMessage = isAuthFailure
      ? 'Authentication failed: Incorrect password or message was modified.'
      : 'Decryption failed: Message could not be authenticated or payload is corrupted.';

    return {
      success: false,
      executionTimeMs: duration,
      error: errorMessage,
    };
  }
}
