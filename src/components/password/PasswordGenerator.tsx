/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';
import { generateSecurePassword, calculatePasswordStrength } from '../../services/passwordService';
import { copyToClipboard } from '../../utils/clipboard';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { PasswordStrength } from './PasswordStrength';

export interface PasswordGeneratorProps {
  onSelectPassword?: (password: string) => void;
  onCopyNotice?: (message: string) => void;
  initialLength?: number;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onSelectPassword,
  onCopyNotice,
  initialLength = 20,
}) => {
  const [length, setLength] = useState(initialLength);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    setError(null);
    const result = generateSecurePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });

    if (result.error) {
      setError(result.error);
      setGeneratedPassword('');
    } else if (result.password) {
      setGeneratedPassword(result.password);
      setCopied(false);
    }
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Generate once on mount
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async () => {
    if (!generatedPassword) return;
    const res = await copyToClipboard(generatedPassword);
    if (res.success) {
      setCopied(true);
      onCopyNotice?.('Generated password copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strength = calculatePasswordStrength(generatedPassword);

  return (
    <div className="space-y-4">
      {/* Generated password display */}
      <div className="p-3.5 rounded-xl border bg-white dark:bg-[#0B100D] border-[#DCE8DE] dark:border-emerald-500/20">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4]">
            Cryptographically Generated Key
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              size="sm"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </IconButton>
            <IconButton
              aria-label="Copy generated password"
              size="sm"
              onClick={handleCopy}
              disabled={!generatedPassword}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </IconButton>
          </div>
        </div>

        <div className="font-mono text-sm sm:text-base break-all tracking-wide text-[#17251B] dark:text-emerald-400 select-all py-1">
          {generatedPassword ? (
            showPassword ? (
              generatedPassword
            ) : (
              '•'.repeat(generatedPassword.length)
            )
          ) : (
            <span className="text-red-500 text-xs">{error || 'No character sets selected'}</span>
          )}
        </div>
      </div>

      {/* Strength indicator */}
      {generatedPassword && <PasswordStrength strength={strength} showDetails={false} />}

      {/* Length slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="pwd-length-slider" className="font-medium text-[#17251B] dark:text-[#F8FAFC]">
            Length: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{length}</span> chars
          </label>
          <span className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">Recommended: 16–32</span>
        </div>
        <input
          id="pwd-length-slider"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Character group toggles */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#16201A] transition-colors">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="rounded accent-emerald-500 cursor-pointer"
          />
          <span className="text-[#17251B] dark:text-[#F8FAFC]">Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#16201A] transition-colors">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="rounded accent-emerald-500 cursor-pointer"
          />
          <span className="text-[#17251B] dark:text-[#F8FAFC]">Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#16201A] transition-colors">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded accent-emerald-500 cursor-pointer"
          />
          <span className="text-[#17251B] dark:text-[#F8FAFC]">Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#16201A] transition-colors">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded accent-emerald-500 cursor-pointer"
          />
          <span className="text-[#17251B] dark:text-[#F8FAFC]">Symbols (!@#$)</span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCE8DE] dark:border-emerald-500/15">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={handleGenerate}
        >
          Regenerate
        </Button>

        <div className="flex items-center gap-2">
          {onSelectPassword && generatedPassword && (
            <Button
              size="sm"
              leftIcon={<Shield className="w-3.5 h-3.5" />}
              onClick={() => onSelectPassword(generatedPassword)}
            >
              Use This Password
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
            disabled={!generatedPassword}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </div>
  );
};
