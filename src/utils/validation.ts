/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ENVELOPE_PREFIX } from '../config/encryptionConfig';
import { SecureVaultEnvelope } from '../types/encryption';

export interface EnvelopeValidationResult {
  isValid: boolean;
  envelope?: SecureVaultEnvelope;
  error?: string;
}

/**
 * Validates whether the given string is a formatted SecureVault encrypted message.
 */
export function validateAndParseEnvelope(input: string): EnvelopeValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please paste or enter an encrypted message to decrypt.',
    };
  }

  try {
    let jsonStr: string;

    if (trimmed.startsWith(ENVELOPE_PREFIX)) {
      // Base64 encoded JSON envelope payload
      const encodedPayload = trimmed.slice(ENVELOPE_PREFIX.length);
      jsonStr = atob(encodedPayload);
    } else if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      // Direct JSON envelope string
      jsonStr = trimmed;
    } else {
      return {
        isValid: false,
        error: 'Unrecognized format. Expected a SecureVault encrypted message starting with "SECUREVAULT:v1:".',
      };
    }

    const parsed = JSON.parse(jsonStr) as Partial<SecureVaultEnvelope>;

    if (parsed.format !== 'SECUREVAULT') {
      return {
        isValid: false,
        error: 'Invalid message envelope: format identifier does not match SecureVault.',
      };
    }

    if (parsed.version !== 1) {
      return {
        isValid: false,
        error: `Unsupported envelope version: ${parsed.version}. Only version 1 is supported.`,
      };
    }

    if (!parsed.algorithm || !parsed.kdf || !parsed.salt || !parsed.iv || !parsed.ciphertext) {
      return {
        isValid: false,
        error: 'Corrupted message: missing required cryptographic components (salt, IV, or ciphertext).',
      };
    }

    if (typeof parsed.iterations !== 'number' || parsed.iterations < 1000) {
      return {
        isValid: false,
        error: 'Invalid iteration count in envelope header.',
      };
    }

    return {
      isValid: true,
      envelope: parsed as SecureVaultEnvelope,
    };
  } catch {
    return {
      isValid: false,
      error: 'Failed to parse encrypted payload. The data may be incomplete or truncated.',
    };
  }
}

/**
 * Validates plaintext input.
 */
export function validatePlaintext(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Please enter text to encrypt.' };
  }
  return { isValid: true };
}

/**
 * Validates password input.
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'For adequate security, password must be at least 8 characters.' };
  }
  return { isValid: true };
}
