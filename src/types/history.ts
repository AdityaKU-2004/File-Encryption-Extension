/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OperationType = 'encrypt' | 'decrypt';
export type OperationStatus = 'success' | 'failure';

/**
 * Strict privacy-preserving file operation history entry.
 * Plaintext file contents, decrypted files, and passwords are NEVER persisted.
 */
export interface FileHistoryEntry {
  id: string;
  filename: string;
  operation: OperationType;
  status: OperationStatus;
  timestamp: number; // Unix epoch ms
  fileSize: number;  // bytes
  executionTimeMs: number;
  algorithm: string;
  errorMessage?: string;
}
