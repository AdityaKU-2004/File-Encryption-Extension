/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp } from 'lucide-react';
import { Button } from '../common/Button';

export interface FileDropZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  accept = '*/*',
  multiple = true,
  title = 'Drop your files here',
  subtitle = 'or browse your device',
  buttonLabel = 'Select Files',
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input value so re-selecting the exact same file fires onChange
      e.target.value = '';
    }
  };

  const triggerPicker = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPicker();
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Upload files area. Drag and drop files or press to browse."
      className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        isDragOver
          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 scale-[1.005]'
          : 'border-[#DCE8DE] dark:border-emerald-500/20 bg-white/40 dark:bg-[#101612]/40 hover:border-emerald-500/40 hover:bg-white/60 dark:hover:bg-[#101612]/60'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-4 transition-transform group-hover:scale-105">
        <UploadCloud className="w-8 h-8" />
      </div>

      <h3 className="text-base font-semibold text-[#17251B] dark:text-[#F8FAFC]">
        {title}
      </h3>
      <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 mb-5">
        {subtitle}
      </p>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        leftIcon={<FileUp className="w-3.5 h-3.5" />}
        onClick={(e) => {
          e.stopPropagation();
          triggerPicker();
        }}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>

      <div className="mt-4 text-[11px] text-[#647067] dark:text-[#A1AAA4]">
        Supports all video, document, spreadsheet, image, audio, archive, and arbitrary binary files
      </div>
    </div>
  );
};
