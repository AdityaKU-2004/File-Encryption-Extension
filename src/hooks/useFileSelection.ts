/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { quickValidateContainerHeader } from '../services/encryptedFileFormat';
import { FileOperationStatus, SelectedFileItem } from '../types/file';
import { detectFileCategory, getFileExtension } from '../utils/filename';

export function useFileSelection(mode: 'encrypt' | 'decrypt' = 'encrypt') {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const filesArray = Array.from(fileList);
      if (filesArray.length === 0) return;

      const newItems: SelectedFileItem[] = [];

      for (const file of filesArray) {
        const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const ext = getFileExtension(file.name);
        const category = detectFileCategory(file.name, file.type);

        let isValidEncrypted: boolean | undefined = undefined;
        if (mode === 'decrypt') {
          const check = await quickValidateContainerHeader(file);
          isValidEncrypted = check.isValid;
        }

        newItems.push({
          id,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          extension: ext,
          category,
          status: 'idle',
          progress: 0,
          processedBytes: 0,
          totalBytes: file.size,
          isValidEncryptedFormat: isValidEncrypted,
        });
      }

      setSelectedFiles((prev) => [...prev, ...newItems]);
    },
    [mode]
  );

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const updateFileStatus = useCallback(
    (
      id: string,
      updates: Partial<{
        status: FileOperationStatus;
        progress: number;
        processedBytes: number;
        errorMessage: string;
        encryptedBlob: Blob;
        decryptedBlob: Blob;
        recoveredFilename: string;
        recoveredMimeType: string;
        executionTimeMs: number;
      }>
    ) => {
      setSelectedFiles((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  return {
    selectedFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFileStatus,
    hasFiles: selectedFiles.length > 0,
    totalSizeBytes: selectedFiles.reduce((acc, f) => acc + f.size, 0),
  };
}
