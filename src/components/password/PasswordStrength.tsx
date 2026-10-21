/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordStrengthResult } from '../../types/encryption';

export interface PasswordStrengthProps {
  strength: PasswordStrengthResult;
  showDetails?: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  strength,
  showDetails = true,
}) => {
  const { score, label, entropyBits, hasLength, hasUppercase, hasLowercase, hasNumber, hasSymbol } =
    strength;

  const scoreColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-emerald-400',
  ];

  const labelColors = [
    'text-red-500 dark:text-red-400',
    'text-orange-500 dark:text-orange-400',
    'text-amber-500 dark:text-amber-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-emerald-500 dark:text-emerald-300 font-semibold',
  ];

  return (
    <div className="space-y-2.5 pt-1">
      {/* Strength meter bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#647067] dark:text-[#A1AAA4]">Strength Rating:</span>
          <span className={`font-medium ${labelColors[score]}`}>
            {label}
            {entropyBits > 0 && (
              <span className="ml-1 text-[11px] font-mono text-[#647067] dark:text-[#A1AAA4]">
                (~{entropyBits} bits)
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                score > index
                  ? scoreColors[score]
                  : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirement checklist */}
      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-3 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            {hasLength ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-400 shrink-0" />
            )}
            <span className={hasLength ? 'text-[#17251B] dark:text-[#F8FAFC]' : 'text-neutral-400'}>
              12+ Characters
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasUppercase ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-400 shrink-0" />
            )}
            <span className={hasUppercase ? 'text-[#17251B] dark:text-[#F8FAFC]' : 'text-neutral-400'}>
              Uppercase (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasLowercase ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-400 shrink-0" />
            )}
            <span className={hasLowercase ? 'text-[#17251B] dark:text-[#F8FAFC]' : 'text-neutral-400'}>
              Lowercase (a-z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasNumber ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-400 shrink-0" />
            )}
            <span className={hasNumber ? 'text-[#17251B] dark:text-[#F8FAFC]' : 'text-neutral-400'}>
              Numbers (0-9)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasSymbol ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-neutral-400 shrink-0" />
            )}
            <span className={hasSymbol ? 'text-[#17251B] dark:text-[#F8FAFC]' : 'text-neutral-400'}>
              Symbols (!@#$)
            </span>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] italic">
        * Local heuristic estimate. Security also depends on avoiding reused or previously leaked passwords.
      </p>
    </div>
  );
};
