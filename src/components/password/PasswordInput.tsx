/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { Eye, EyeOff, KeyRound, X } from 'lucide-react';
import { IconButton } from '../common/IconButton';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  onClear?: () => void;
  showKeyIcon?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = 'Password',
      error,
      helperText,
      value = '',
      onChange,
      onClear,
      showKeyIcon = true,
      className = '',
      id,
      placeholder = 'Enter password...',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasValue = typeof value === 'string' && value.length > 0;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {showKeyIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <KeyRound className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full text-sm rounded-lg border transition-all duration-150 py-2.5 bg-white text-[#17251B] placeholder-neutral-400 border-[#DCE8DE] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:bg-[#0B100D] dark:text-[#F8FAFC] dark:placeholder-[#64746B] dark:border-emerald-500/20 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20 font-mono ${
              showKeyIcon ? 'pl-10' : 'pl-3.5'
            } pr-20 ${
              error
                ? 'border-red-500 dark:border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                : ''
            } ${className}`}
            {...props}
          />

          <div className="absolute right-2 flex items-center gap-0.5">
            {onClear && hasValue && (
              <IconButton
                aria-label="Clear password"
                title="Clear password"
                size="sm"
                onClick={onClear}
              >
                <X className="w-3.5 h-3.5" />
              </IconButton>
            )}

            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              size="sm"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </IconButton>
          </div>
        </div>

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

PasswordInput.displayName = 'PasswordInput';
