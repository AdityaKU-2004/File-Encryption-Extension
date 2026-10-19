/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EncryptionRequest, EncryptionResult } from '../types/encryption';
import { validatePassword, validatePlaintext } from '../utils/validation';
import { encryptWithWebCrypto, isWebCryptoAvailable } from './webCryptoService';

export interface EncryptionServiceInterface {
  isAvailable(): boolean;
  encrypt(request: EncryptionRequest): Promise<EncryptionResult>;
}

export class EncryptionService implements EncryptionServiceInterface {
  isAvailable(): boolean {
    return isWebCryptoAvailable();
  }

  async encrypt(request: EncryptionRequest): Promise<EncryptionResult> {
    // 1. Validate plaintext
    const plaintextValidation = validatePlaintext(request.plaintext);
    if (!plaintextValidation.isValid) {
      return {
        success: false,
        encryptedText: '',
        characterCount: 0,
        executionTimeMs: 0,
        error: plaintextValidation.error,
      };
    }

    // 2. Validate password
    const passwordValidation = validatePassword(request.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        encryptedText: '',
        characterCount: 0,
        executionTimeMs: 0,
        error: passwordValidation.error,
      };
    }

    // 3. Delegate to native Web Crypto AES-256-GCM
    return encryptWithWebCrypto(request);
  }
}

export const encryptionService = new EncryptionService();
