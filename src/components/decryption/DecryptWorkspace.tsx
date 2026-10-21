/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Unlock,
  Download,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useFileSelection } from '../../hooks/useFileSelection';
import { decryptFile } from '../../services/fileDecryptionService';
import { FileHistoryEntry } from '../../types/history';
import { downloadBlob } from '../../utils/download';
import { formatFileSize } from '../../utils/fileSize';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { BatchProgress } from '../files/BatchProgress';
import { FileDropZone } from '../files/FileDropZone';
import { FileList } from '../files/FileList';
import { PasswordInput } from '../password/PasswordInput';

export interface DecryptWorkspaceProps {
  onRecordHistory?: (entry: Omit<FileHistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DecryptWorkspace: React.FC<DecryptWorkspaceProps> = ({
  onRecordHistory,
  onNotify,
}) => {
  const {
    selectedFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFileStatus,
    hasFiles,
    totalSizeBytes,
  } = useFileSelection('decrypt');

  // Password state
  const [password, setPassword] = useState('');

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [processedBytes, setProcessedBytes] = useState(0);

  // Errors
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Abort controller ref for batch cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDecryptAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setGeneralError(null);

    if (!hasFiles) {
      setGeneralError('Please select at least one encrypted file to decrypt.');
      return;
    }

    if (!password) {
      setPasswordError('Password is required to decrypt your files.');
      return;
    }

    setIsProcessing(true);
    setCompletedCount(0);
    setFailedCount(0);
    setProcessedBytes(0);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let successfulFiles = 0;
    let failedFiles = 0;
    let accumulatedBytes = 0;

    for (const item of selectedFiles) {
      if (abortController.signal.aborted) {
        updateFileStatus(item.id, { status: 'cancelled' });
        continue;
      }

      updateFileStatus(item.id, {
        status: 'decrypting',
        progress: 0,
        processedBytes: 0,
        errorMessage: undefined,
      });

      try {
        const result = await decryptFile({
          file: item.file,
          password,
          signal: abortController.signal,
          onProgress: (pBytes) => {
            updateFileStatus(item.id, {
              processedBytes: pBytes,
              progress: Math.round((pBytes / item.size) * 100),
            });
            setProcessedBytes(accumulatedBytes + pBytes);
          },
        });

        if (result.success && result.decryptedBlob) {
          successfulFiles++;
          setCompletedCount(successfulFiles);
          accumulatedBytes += item.size;
          setProcessedBytes(accumulatedBytes);

          updateFileStatus(item.id, {
            status: 'completed',
            progress: 100,
            processedBytes: item.size,
            decryptedBlob: result.decryptedBlob,
            recoveredFilename: result.originalFilename,
            recoveredMimeType: result.originalMimeType,
            executionTimeMs: result.executionTimeMs,
          });

          onRecordHistory?.({
            filename: result.originalFilename || item.name,
            operation: 'decrypt',
            status: 'success',
            timestamp: Date.now(),
            fileSize: result.originalSize || item.size,
            executionTimeMs: result.executionTimeMs,
            algorithm: 'AES-256-GCM',
          });
        } else {
          failedFiles++;
          setFailedCount(failedFiles);

          updateFileStatus(item.id, {
            status: 'failed',
            errorMessage:
              result.error ||
              'Decryption failed. The password may be incorrect, or the file may be corrupted.',
          });

          onRecordHistory?.({
            filename: item.name,
            operation: 'decrypt',
            status: 'failure',
            timestamp: Date.now(),
            fileSize: item.size,
            executionTimeMs: result.executionTimeMs,
            algorithm: 'AES-256-GCM',
            errorMessage: result.error,
          });
        }
      } catch (err) {
        failedFiles++;
        setFailedCount(failedFiles);
        updateFileStatus(item.id, {
          status: 'failed',
          errorMessage:
            err instanceof Error
              ? err.message
              : 'Decryption failed. The password may be incorrect, or the file may be corrupted.',
        });
      }
    }

    setIsProcessing(false);
    abortControllerRef.current = null;

    if (successfulFiles > 0) {
      onNotify?.(
        `Successfully decrypted ${successfulFiles} file${successfulFiles === 1 ? '' : 's'}`,
        'success'
      );
    } else if (failedFiles > 0) {
      setGeneralError(
        'Decryption failed for selected files. Ensure the password is correct and files are authentic .svault containers.'
      );
    }
  };

  const handleCancelBatch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      onNotify?.('Decryption batch cancelled by user', 'info');
    }
  };

  const handleDownloadAllRecovered = () => {
    const completedItems = selectedFiles.filter((f) => f.status === 'completed' && f.decryptedBlob);
    for (const item of completedItems) {
      if (item.decryptedBlob && item.recoveredFilename) {
        downloadBlob(item.decryptedBlob, item.recoveredFilename);
      }
    }
    onNotify?.(`Triggered download for ${completedItems.length} recovered files`, 'success');
  };

  const completedDecryptedCount = selectedFiles.filter(
    (f) => f.status === 'completed' && f.decryptedBlob
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          Decrypt Files
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          Recover your original files using the correct password. Restores original bytes, names, and formats.
        </p>
      </div>

      <form onSubmit={handleDecryptAll} className="space-y-6">
        {/* A. File Selection Area */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <FileDropZone
            onFilesSelected={addFiles}
            title="Drop encrypted files here"
            subtitle="Select .svault files or browse your device"
            buttonLabel="Select Encrypted Files"
            accept=".svault,*/*"
            disabled={isProcessing}
          />

          {/* Selected File List */}
          <FileList
            files={selectedFiles}
            mode="decrypt"
            onRemove={removeFile}
            onClearAll={clearAllFiles}
            isProcessing={isProcessing}
            onNotify={onNotify}
          />
        </GlassCard>

        {/* B. Decryption Password Card */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
              Decryption Password
            </span>
          </div>

          <PasswordInput
            label="Password"
            placeholder="Enter password used during encryption..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            onClear={() => setPassword('')}
            error={passwordError || undefined}
            helperText="The password is required to derive the AES key and verify the GCM authentication tag."
            disabled={isProcessing}
          />
        </GlassCard>

        {/* Batch Progress Bar */}
        {isProcessing && (
          <BatchProgress
            totalFiles={selectedFiles.length}
            completedFiles={completedCount}
            failedFiles={failedCount}
            processedBytes={processedBytes}
            totalBytes={totalSizeBytes}
            isProcessing={isProcessing}
            onCancel={handleCancelBatch}
          />
        )}

        {generalError && (
          <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication or Decryption Error</p>
              <p className="mt-0.5 leading-relaxed">{generalError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-[#647067] dark:text-[#A1AAA4] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero partial plaintext release on authentication failure</span>
          </div>

          <div className="flex items-center gap-2">
            {completedDecryptedCount > 1 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadAllRecovered}
              >
                Download All ({completedDecryptedCount})
              </Button>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isProcessing}
              leftIcon={<Unlock className="w-4 h-4" />}
              disabled={!hasFiles || !password}
            >
              {isProcessing
                ? 'Decrypting and Authenticating...'
                : hasFiles
                ? `Decrypt ${selectedFiles.length} File${selectedFiles.length === 1 ? '' : 's'} (${formatFileSize(totalSizeBytes)})`
                : 'Decrypt Files'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
