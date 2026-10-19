/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OperationType = 'encrypt' | 'decrypt';
export type OperationStatus = 'success' | 'failure';

/**
 * Strict privacy-preserving history item.
 * NOTE: Plaintext, passwords, decrypted outputs, and raw ciphertexts are NEVER stored here.
 */
export interface HistoryEntry {
  id: string;
  operation: OperationType;
  status: OperationStatus;
  timestamp: number; // Unix epoch ms
  characterCount: number;
  executionTimeMs: number;
  algorithm: string;
  errorMessage?: string;
}
