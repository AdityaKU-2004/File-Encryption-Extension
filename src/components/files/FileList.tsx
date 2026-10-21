/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { SelectedFileItem } from '../../types/file';
import { formatFileSize } from '../../utils/fileSize';
import { Button } from '../common/Button';
import { FileListItem } from './FileListItem';

export interface FileListProps {
  files: SelectedFileItem[];
  mode: 'encrypt' | 'decrypt';
  onRemove: (id: string) => void;
  onClearAll: () => void;
  isProcessing: boolean;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  mode,
  onRemove,
  onClearAll,
  isProcessing,
  onNotify,
}) => {
  if (files.length === 0) return null;

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs pb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC]">
            Selected Files ({files.length})
          </span>
          <span aria-hidden="true" className="text-neutral-400">·</span>
          <span className="font-mono text-[#647067] dark:text-[#A1AAA4]">
            Total {formatFileSize(totalSize)}
          </span>
        </div>

        {!isProcessing && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {files.map((item) => (
          <FileListItem
            key={item.id}
            item={item}
            mode={mode}
            onRemove={onRemove}
            isProcessing={isProcessing}
            onNotify={onNotify}
          />
        ))}
      </div>
    </div>
  );
};
