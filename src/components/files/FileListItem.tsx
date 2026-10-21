/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash2, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { SelectedFileItem } from '../../types/file';
import { downloadBlob } from '../../utils/download';
import { FileIcon } from '../../utils/fileIcons';
import { formatFileSize } from '../../utils/fileSize';
import { getEncryptedFilename } from '../../utils/filename';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';

export interface FileListItemProps {
  item: SelectedFileItem;
  mode: 'encrypt' | 'decrypt';
  onRemove: (id: string) => void;
  isProcessing: boolean;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  item,
  mode,
  onRemove,
  isProcessing,
  onNotify,
}) => {
  const isCompleted = item.status === 'completed';
  const isFailed = item.status === 'failed';
  const isEncrypting = item.status === 'encrypting' || item.status === 'preparing';
  const isDecrypting = item.status === 'decrypting';

  const handleDownload = () => {
    if (mode === 'encrypt' && item.encryptedBlob) {
      const targetName = getEncryptedFilename(item.name);
      downloadBlob(item.encryptedBlob, targetName);
      onNotify?.(`Downloaded encrypted file ${targetName}`, 'success');
    } else if (mode === 'decrypt' && item.decryptedBlob && item.recoveredFilename) {
      downloadBlob(item.decryptedBlob, item.recoveredFilename);
      onNotify?.(`Downloaded recovered file ${item.recoveredFilename}`, 'success');
    }
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border bg-white/70 dark:bg-[#101612]/70 border-[#DCE8DE] dark:border-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-[#16201A] shrink-0">
          <FileIcon category={item.category} size="md" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm text-[#17251B] dark:text-[#F8FAFC] truncate">
              {item.name}
            </span>
            {item.extension && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#16201A] text-[#647067] dark:text-[#A1AAA4] uppercase">
                {item.extension}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#647067] dark:text-[#A1AAA4]">
            <span className="font-mono">{formatFileSize(item.size)}</span>
            {item.type && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[150px]">{item.type}</span>
              </>
            )}

            {/* Validation badge for decryption */}
            {mode === 'decrypt' && item.isValidEncryptedFormat !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                {item.isValidEncryptedFormat ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Valid .svault container
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    Unrecognized container format
                  </span>
                )}
              </>
            )}

            {isCompleted && item.executionTimeMs !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.executionTimeMs}ms
                </span>
              </>
            )}
          </div>

          {item.errorMessage && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{item.errorMessage}</span>
            </p>
          )}

          {/* Recovered filename display */}
          {mode === 'decrypt' && isCompleted && item.recoveredFilename && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Restored: <span className="font-semibold">{item.recoveredFilename}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Progress or Download or Remove */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {(isEncrypting || isDecrypting) && (
          <div className="w-28 text-right space-y-1">
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              {item.progress}%
            </div>
            <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        )}

        {isCompleted && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-3 h-3" />}
            onClick={handleDownload}
          >
            Download
          </Button>
        )}

        {!isProcessing && (
          <IconButton
            aria-label={`Remove ${item.name}`}
            title="Remove file"
            size="sm"
            variant="ghost"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-red-500" />
          </IconButton>
        )}
      </div>
    </div>
  );
};
