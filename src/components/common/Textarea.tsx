/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';
import { Clipboard, Trash2 } from 'lucide-react';
import { IconButton } from './IconButton';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  onClear?: () => void;
  onPasteClipboard?: () => void;
  monospace?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = true,
      onClear,
      onPasteClipboard,
      monospace = false,
      value = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4]"
            >
              {label}
            </label>
          )}

          <div className="flex items-center gap-1 ml-auto">
            {onPasteClipboard && (
              <IconButton
                aria-label="Paste from clipboard"
                title="Paste from clipboard"
                size="sm"
                onClick={onPasteClipboard}
              >
                <Clipboard className="w-3.5 h-3.5" />
              </IconButton>
            )}

            {onClear && charCount > 0 && (
              <IconButton
                aria-label="Clear text input"
                title="Clear text input"
                size="sm"
                variant="danger"
                onClick={onClear}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </IconButton>
            )}

            {showCharCount && (
              <span className="text-xs font-mono text-[#647067] dark:text-[#A1AAA4] ml-2 select-none">
                {charCount.toLocaleString()} chars
              </span>
            )}
          </div>
        </div>

        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full rounded-lg border text-sm transition-all duration-150 p-3 bg-white text-[#17251B] placeholder-neutral-400 border-[#DCE8DE] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:bg-[#0B100D] dark:text-[#F8FAFC] dark:placeholder-[#64746B] dark:border-emerald-500/20 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20 min-h-[120px] resize-y ${
            monospace ? 'font-mono text-xs' : ''
          } ${
            error
              ? 'border-red-500 dark:border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
              : ''
          } ${className}`}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#647067] dark:text-[#A1AAA4]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
