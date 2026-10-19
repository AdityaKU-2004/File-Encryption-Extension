/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DecryptionRequest, DecryptionResult } from '../types/encryption';
import { validateAndParseEnvelope } from '../utils/validation';
import { decryptWithWebCrypto, isWebCryptoAvailable } from './webCryptoService';

export interface DecryptionServiceInterface {
  isAvailable(): boolean;
  decrypt(request: DecryptionRequest): Promise<DecryptionResult>;
}

export class DecryptionService implements DecryptionServiceInterface {
  isAvailable(): boolean {
    return isWebCryptoAvailable();
  }

  async decrypt(request: DecryptionRequest): Promise<DecryptionResult> {
    // 1. Validate envelope presence
    const envelopeValidation = validateAndParseEnvelope(request.encryptedText);
    if (!envelopeValidation.isValid) {
      return {
        success: false,
        executionTimeMs: 0,
        error: envelopeValidation.error,
      };
    }

    // 2. Validate password presence
    if (!request.password) {
      return {
        success: false,
        executionTimeMs: 0,
        error: 'Password is required to decrypt this message.',
      };
    }

    // 3. Delegate to native Web Crypto AES-256-GCM
    return decryptWithWebCrypto(request);
  }
}

export const decryptionService = new DecryptionService();
