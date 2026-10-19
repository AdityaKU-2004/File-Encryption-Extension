/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedAlgorithm = 'AES-GCM';
export type SupportedKDF = 'PBKDF2';
export type SupportedHash = 'SHA-256';

export interface CryptoConfig {
  algorithm: SupportedAlgorithm;
  keyLength: 256;
  kdf: SupportedKDF;
  hash: SupportedHash;
  iterations: number;
  saltLength: number; // in bytes (default 16)
  ivLength: number;   // in bytes (default 12 for AES-GCM)
}

/**
 * Standard SecureVault envelope structure for serialized encrypted messages.
 */
export interface SecureVaultEnvelope {
  format: 'SECUREVAULT';
  version: 1;
  algorithm: 'AES-256-GCM';
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;       // Base64 encoded 16-byte random salt
  iv: string;         // Base64 encoded 12-byte random IV
  ciphertext: string; // Base64 encoded ciphertext + GCM auth tag
  createdAt: string;  // ISO timestamp of encryption
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

export interface PasswordStrengthResult {
  score: number; // 0 to 4 (0: Very Weak, 1: Weak, 2: Fair, 3: Good, 4: Strong)
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  entropyBits: number;
  hasLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  feedback: string[];
}
