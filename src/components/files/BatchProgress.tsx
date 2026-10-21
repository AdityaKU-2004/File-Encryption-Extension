/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../../utils/fileSize';
import { Button } from '../common/Button';

export interface BatchProgressProps {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  processedBytes: number;
  totalBytes: number;
  isProcessing: boolean;
  onCancel?: () => void;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({
  totalFiles,
  completedFiles,
  failedFiles,
  processedBytes,
  totalBytes,
  isProcessing,
  onCancel,
}) => {
  const percent = totalBytes > 0 ? Math.round((processedBytes / totalBytes) * 100) : 0;
  const isDone = !isProcessing && (completedFiles + failedFiles === totalFiles) && totalFiles > 0;

  return (
    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC]">
            {isProcessing ? 'Batch Processing in Progress...' : 'Batch Completed'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[#647067] dark:text-[#A1AAA4]">
            {completedFiles}/{totalFiles} files · {formatFileSize(processedBytes)} / {formatFileSize(totalBytes)} ({percent}%)
          </span>

          {isProcessing && onCancel && (
            <Button variant="danger" size="sm" onClick={onCancel}>
              Cancel All
            </Button>
          )}
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>

      {failedFiles > 0 && (
        <p className="text-[11px] text-red-600 dark:text-red-400">
          {failedFiles} file{failedFiles === 1 ? '' : 's'} encountered authentication or format errors.
        </p>
      )}
    </div>
  );
};
