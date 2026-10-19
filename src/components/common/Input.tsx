/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftElement, rightElement, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

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
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              {leftElement}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full text-sm rounded-lg border transition-all duration-150 py-2.5 bg-white text-[#17251B] placeholder-neutral-400 border-[#DCE8DE] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:bg-[#0B100D] dark:text-[#F8FAFC] dark:placeholder-[#64746B] dark:border-emerald-500/20 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20 ${
              leftElement ? 'pl-10' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-red-500 dark:border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                : ''
            } ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          )}
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

Input.displayName = 'Input';
