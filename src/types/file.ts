/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileOperationStatus =
  | 'idle'
  | 'waiting'
  | 'preparing'
  | 'encrypting'
  | 'decrypting'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type FileCategory =
  | 'video'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'image'
  | 'audio'
  | 'archive'
  | 'code'
  | 'encrypted'
  | 'other';

/**
 * UI representation of a selected file.
 * The underlying File handle is held in memory for streaming/processing,
 * avoiding holding massive buffers in React component state.
 */
export interface SelectedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  extension: string;
  category: FileCategory;
  status: FileOperationStatus;
  progress: number; // 0 to 100
  processedBytes: number;
  totalBytes: number;
  errorMessage?: string;
  encryptedBlob?: Blob;
  decryptedBlob?: Blob;
  recoveredFilename?: string;
  recoveredMimeType?: string;
  executionTimeMs?: number;
  isValidEncryptedFormat?: boolean;
}

/**
 * Metadata stored securely inside the authenticated encrypted envelope.
 */
export interface FileMetadataPayload {
  originalName: string;
  originalSize: number;
  originalMimeType: string;
  encryptedAt: string;
}

/**
 * Parsed binary header of a .svault container.
 */
export interface ParsedContainerHeader {
  isValid: boolean;
  version: number;
  iterations: number;
  salt: Uint8Array;
  iv: Uint8Array;
  metadataLength: number;
  metadataOffset: number;
  payloadOffset: number;
  error?: string;
}
