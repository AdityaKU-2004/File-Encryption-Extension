/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CryptoConfig } from '../types/encryption';

export const APP_NAME = 'SecureVault';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Your data. Your privacy. Your control.';

export const ENVELOPE_PREFIX = 'SECUREVAULT:v1:';

export const DEFAULT_CRYPTO_CONFIG: Readonly<CryptoConfig> = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  kdf: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 100_000, // Standard OWASP recommendation for PBKDF2-HMAC-SHA256
  saltLength: 16,      // 128-bit salt
  ivLength: 12,        // 96-bit initialization vector standard for AES-GCM
};

export const ALLOWED_ITERATION_OPTIONS = [
  { value: 100_000, label: '100,000 iterations (Standard Recommended)' },
  { value: 250_000, label: '250,000 iterations (High Security)' },
  { value: 600_000, label: '600,000 iterations (Maximum Security - OWASP 2023)' },
];
