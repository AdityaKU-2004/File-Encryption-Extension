/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileMetadataPayload } from './file';

export type SupportedAlgorithm = 'AES-GCM';
export type SupportedKDF = 'PBKDF2';
export type SupportedHash = 'SHA-256';

export interface CryptoConfig {
  algorithm: SupportedAlgorithm;
  keyLength: 256;
  kdf: SupportedKDF;
  hash: SupportedHash;
  iterations: number;
  saltLength: number;
  ivLength: number;
}

export interface SecureVaultEnvelope {
  format: 'SECUREVAULT';
  version: 1;
  algorithm: 'AES-256-GCM';
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  createdAt: string;
}

export interface EncryptionRequest {
  plaintext: string;
  password: string;
  iterations?: number;
}

export interface EncryptionResult {
  success: boolean;
  encryptedText: string;
  envelope?: SecureVaultEnvelope;
  executionTimeMs: number;
  characterCount: number;
  error?: string;
}

export interface DecryptionRequest {
  encryptedText: string;
  password: string;
}

export interface DecryptionResult {
  success: boolean;
  decryptedText?: string;
  executionTimeMs: number;
  envelopeMetadata?: {
    algorithm: string;
    iterations: number;
    createdAt?: string;
  };
  error?: string;
}

export interface FileEncryptionRequest {
  file: File;
  password: string;
  iterations?: number;
  onProgress?: (processedBytes: number, totalBytes: number) => void;
  signal?: AbortSignal;
}

export interface FileEncryptionResult {
  success: boolean;
  encryptedBlob?: Blob;
  encryptedFilename: string;
  executionTimeMs: number;
  originalSize: number;
  encryptedSize: number;
  error?: string;
}

export interface FileDecryptionRequest {
  file: File;
  password: string;
  onProgress?: (processedBytes: number, totalBytes: number) => void;
  signal?: AbortSignal;
}

export interface FileDecryptionResult {
  success: boolean;
  decryptedBlob?: Blob;
  originalFilename: string;
  originalMimeType: string;
  originalSize: number;
  executionTimeMs: number;
  error?: string;
}

export interface PasswordStrengthResult {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  entropyBits: number;
  hasLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  feedback: string[];
}
