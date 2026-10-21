/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FileOperationStatus } from '../../types/file';
import { formatFileSize } from '../../utils/fileSize';
import { IconButton } from '../common/IconButton';

export interface FileProgressProps {
  filename: string;
  operation: 'encrypt' | 'decrypt';
  status: FileOperationStatus;
  progress: number;
  processedBytes: number;
  totalBytes: number;
  errorMessage?: string;
  executionTimeMs?: number;
  onCancel?: () => void;
}

export const FileProgress: React.FC<FileProgressProps> = ({
  filename,
  operation,
  status,
  progress,
  processedBytes,
  totalBytes,
  errorMessage,
  executionTimeMs,
  onCancel,
}) => {
  const isRunning = status === 'encrypting' || status === 'decrypting' || status === 'preparing';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled';

  const statusLabels: Record<FileOperationStatus, string> = {
    idle: 'Ready',
    waiting: 'Waiting in queue',
    preparing: 'Deriving cryptographic keys...',
    encrypting: 'Encrypting with AES-256-GCM...',
    decrypting: 'Decrypting and authenticating...',
    completed: 'Completed successfully',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="p-3.5 rounded-xl border bg-white/70 dark:bg-[#101612]/70 border-[#DCE8DE] dark:border-emerald-500/20 space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0 flex items-center gap-2">
          {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 shrink-0" />}
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
          {isFailed && <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
          <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC] truncate">
            {filename}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[#647067] dark:text-[#A1AAA4]">
            {formatFileSize(processedBytes)} / {formatFileSize(totalBytes)} ({progress}%)
          </span>

          {isRunning && onCancel && (
            <IconButton
              aria-label="Cancel operation"
              title="Cancel"
              size="sm"
              onClick={onCancel}
            >
              <X className="w-3 h-3 text-neutral-400 hover:text-red-500" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-200 rounded-full ${
            isFailed
              ? 'bg-red-500'
              : isCompleted
              ? 'bg-emerald-500'
              : 'bg-emerald-500 animate-pulse'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span
          className={
            isFailed
              ? 'text-red-600 dark:text-red-400 font-medium'
              : isCompleted
              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
              : 'text-[#647067] dark:text-[#A1AAA4]'
          }
        >
          {errorMessage || statusLabels[status]}
        </span>

        {isCompleted && executionTimeMs !== undefined && (
          <span className="font-mono text-[10px] text-[#647067] dark:text-[#A1AAA4]">
            {executionTimeMs}ms
          </span>
        )}
      </div>
    </div>
  );
};
