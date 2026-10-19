/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Copy,
  Check,
  Download,
  Trash2,
  Sun,
  Moon,
  Maximize2,
  Settings,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../config/encryptionConfig';
import { encryptionService } from '../../services/encryptionService';
import { decryptionService } from '../../services/decryptionService';
import { calculatePasswordStrength } from '../../services/passwordService';
import { HistoryEntry } from '../../types/history';
import { LayoutMode, ThemeMode } from '../../types/settings';
import { copyToClipboard, readFromClipboard } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';
import { PasswordGenerator } from '../password/PasswordGenerator';
import { PasswordInput } from '../password/PasswordInput';
import { PasswordStrength } from '../password/PasswordStrength';

export interface PopupLayoutProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSwitchToDashboard: () => void;
  onRecordHistory?: (entry: Omit<HistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type PopupTab = 'encrypt' | 'decrypt' | 'generator' | 'settings';

export const PopupLayout: React.FC<PopupLayoutProps> = ({
  theme,
  onToggleTheme,
  onSwitchToDashboard,
  onRecordHistory,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<PopupTab>('encrypt');

  // Encrypt state
  const [encryptText, setEncryptText] = useState('');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [encryptResult, setEncryptResult] = useState<string | null>(null);
  const [encryptTimeMs, setEncryptTimeMs] = useState<number | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptError, setEncryptError] = useState<string | null>(null);

  // Decrypt state
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptResult, setDecryptResult] = useState<string | null>(null);
  const [decryptTimeMs, setDecryptTimeMs] = useState<number | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  // Copy states
  const [copiedEncrypted, setCopiedEncrypted] = useState(false);
  const [copiedDecrypted, setCopiedDecrypted] = useState(false);

  const encryptStrength = calculatePasswordStrength(encryptPassword);

  // Paste handlers
  const handlePasteToEncrypt = async () => {
    const res = await readFromClipboard();
    if (res.success && res.text) {
      setEncryptText(res.text);
      setEncryptError(null);
    }
  };

  const handlePasteToDecrypt = async () => {
    const res = await readFromClipboard();
    if (res.success && res.text) {
      setDecryptInput(res.text);
      setDecryptError(null);
    }
  };

  // Encrypt execution
  const handleEncryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEncryptError(null);

    if (!encryptText.trim()) {
      setEncryptError('Please enter text to encrypt.');
      return;
    }
    if (!encryptPassword) {
      setEncryptError('Password is required.');
      return;
    }

    setIsEncrypting(true);

    try {
      const res = await encryptionService.encrypt({
        plaintext: encryptText,
        password: encryptPassword,
      });

      if (res.success) {
        setEncryptResult(res.encryptedText);
        setEncryptTimeMs(res.executionTimeMs);
        onRecordHistory?.({
          operation: 'encrypt',
          status: 'success',
          timestamp: Date.now(),
          characterCount: encryptText.length,
          executionTimeMs: res.executionTimeMs,
          algorithm: 'AES-256-GCM',
        });
        onNotify?.('Message encrypted locally', 'success');
      } else {
        setEncryptError(res.error || 'Encryption failed.');
      }
    } finally {
      setIsEncrypting(false);
    }
  };

  // Decrypt execution
  const handleDecryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecryptError(null);

    if (!decryptInput.trim()) {
      setDecryptError('Please paste encrypted payload.');
      return;
    }
    if (!decryptPassword) {
      setDecryptError('Password is required.');
      return;
    }

    setIsDecrypting(true);

    try {
      const res = await decryptionService.decrypt({
        encryptedText: decryptInput,
        password: decryptPassword,
      });

      if (res.success && res.decryptedText !== undefined) {
        setDecryptResult(res.decryptedText);
        setDecryptTimeMs(res.executionTimeMs);
        onRecordHistory?.({
          operation: 'decrypt',
          status: 'success',
          timestamp: Date.now(),
          characterCount: decryptInput.length,
          executionTimeMs: res.executionTimeMs,
          algorithm: 'AES-256-GCM',
        });
        onNotify?.('Message decrypted successfully', 'success');
      } else {
        setDecryptError(res.error || 'Decryption failed.');
        onRecordHistory?.({
          operation: 'decrypt',
          status: 'failure',
          timestamp: Date.now(),
          characterCount: decryptInput.length,
          executionTimeMs: res.executionTimeMs,
          algorithm: 'AES-256-GCM',
          errorMessage: res.error,
        });
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopyEncryptedResult = async () => {
    if (!encryptResult) return;
    const res = await copyToClipboard(encryptResult);
    if (res.success) {
      setCopiedEncrypted(true);
      onNotify?.('Copied to clipboard', 'info');
      setTimeout(() => setCopiedEncrypted(false), 2000);
    }
  };

  const handleCopyDecryptedResult = async () => {
    if (!decryptResult) return;
    const res = await copyToClipboard(decryptResult);
    if (res.success) {
      setCopiedDecrypted(true);
      onNotify?.('Copied to clipboard', 'info');
      setTimeout(() => setCopiedDecrypted(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-neutral-950/40">
      {/* 390px Popup Frame */}
      <div className="w-full max-w-[400px] rounded-2xl border bg-white dark:bg-[#080B09] border-[#DCE8DE] dark:border-emerald-500/20 shadow-2xl overflow-hidden flex flex-col">
        {/* 1. Header & Controls */}
        <div className="flex items-center justify-between p-3.5 border-b border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50/70 dark:bg-[#101612]/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#17251B] dark:text-[#F8FAFC]">
                {APP_NAME}
              </span>
              <span className="text-[10px] text-[#647067] dark:text-[#A1AAA4] ml-1.5 font-mono">
                v{APP_VERSION}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              aria-label="Toggle theme"
              title="Toggle theme"
              size="sm"
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </IconButton>

            <IconButton
              aria-label="Expand to full dashboard"
              title="Expand to Full Dashboard"
              size="sm"
              onClick={onSwitchToDashboard}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </IconButton>
          </div>
        </div>

        {/* 2. Compact Tabs */}
        <div className="grid grid-cols-4 p-1.5 bg-neutral-100/60 dark:bg-[#0B100D] border-b border-[#DCE8DE] dark:border-emerald-500/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('encrypt')}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer text-center ${
              activeTab === 'encrypt'
                ? 'bg-white dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-[#647067] dark:text-[#A1AAA4] hover:text-[#17251B] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Encrypt
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decrypt')}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer text-center ${
              activeTab === 'decrypt'
                ? 'bg-white dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-[#647067] dark:text-[#A1AAA4] hover:text-[#17251B] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Decrypt
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer text-center ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-[#647067] dark:text-[#A1AAA4] hover:text-[#17251B] dark:hover:text-[#F8FAFC]'
            }`}
          >
            PassGen
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer text-center ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-[#647067] dark:text-[#A1AAA4] hover:text-[#17251B] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Config
          </button>
        </div>

        {/* 3. Tab Body */}
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* TAB 1: ENCRYPT */}
          {activeTab === 'encrypt' && (
            <form onSubmit={handleEncryptSubmit} className="space-y-3.5">
              {/* Text Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#647067] dark:text-[#A1AAA4]">Plaintext</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePasteToEncrypt}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Paste
                    </button>
                    {encryptText && (
                      <>
                        <span className="text-neutral-400">·</span>
                        <button
                          type="button"
                          onClick={() => setEncryptText('')}
                          className="text-[11px] text-red-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  value={encryptText}
                  onChange={(e) => {
                    setEncryptText(e.target.value);
                    if (encryptError) setEncryptError(null);
                  }}
                  rows={3}
                  placeholder="Enter text to encrypt..."
                  className="w-full text-xs rounded-lg border p-2.5 bg-neutral-50 dark:bg-[#0B100D] text-[#17251B] dark:text-[#F8FAFC] border-[#DCE8DE] dark:border-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Password Input */}
              <PasswordInput
                label="Password"
                placeholder="Enter password..."
                value={encryptPassword}
                onChange={(e) => {
                  setEncryptPassword(e.target.value);
                  if (encryptError) setEncryptError(null);
                }}
                onClear={() => setEncryptPassword('')}
              />

              {encryptPassword && (
                <PasswordStrength strength={encryptStrength} showDetails={false} />
              )}

              {encryptError && (
                <div className="p-2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{encryptError}</span>
                </div>
              )}

              {/* Encrypt Submit */}
              <Button
                type="submit"
                size="sm"
                className="w-full"
                isLoading={isEncrypting}
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                disabled={!encryptText.trim() || !encryptPassword}
              >
                Encrypt with AES-256-GCM
              </Button>

              {/* Encrypt Output */}
              {encryptResult && (
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <span>Ciphertext Envelope</span>
                    {encryptTimeMs !== null && (
                      <span className="font-mono text-[10px]">{encryptTimeMs}ms</span>
                    )}
                  </div>

                  <div className="max-h-24 overflow-y-auto p-2 rounded bg-neutral-100 dark:bg-[#080B09] font-mono text-[11px] break-all select-all text-[#17251B] dark:text-[#E2E8F0]">
                    {encryptResult}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3 h-3" />}
                      onClick={() => downloadTextFile(encryptResult, 'securevault-encrypted.txt')}
                    >
                      Save TXT
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      leftIcon={copiedEncrypted ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      onClick={handleCopyEncryptedResult}
                    >
                      {copiedEncrypted ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: DECRYPT */}
          {activeTab === 'decrypt' && (
            <form onSubmit={handleDecryptSubmit} className="space-y-3.5">
              {/* Encrypted Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#647067] dark:text-[#A1AAA4]">Ciphertext</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePasteToDecrypt}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Paste
                    </button>
                    {decryptInput && (
                      <>
                        <span className="text-neutral-400">·</span>
                        <button
                          type="button"
                          onClick={() => setDecryptInput('')}
                          className="text-[11px] text-red-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  value={decryptInput}
                  onChange={(e) => {
                    setDecryptInput(e.target.value);
                    if (decryptError) setDecryptError(null);
                  }}
                  rows={3}
                  placeholder="Paste SECUREVAULT:v1:... message"
                  className="w-full text-xs font-mono rounded-lg border p-2.5 bg-neutral-50 dark:bg-[#0B100D] text-[#17251B] dark:text-[#F8FAFC] border-[#DCE8DE] dark:border-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Password Input */}
              <PasswordInput
                label="Password"
                placeholder="Enter decryption password..."
                value={decryptPassword}
                onChange={(e) => {
                  setDecryptPassword(e.target.value);
                  if (decryptError) setDecryptError(null);
                }}
                onClear={() => setDecryptPassword('')}
              />

              {decryptError && (
                <div className="p-2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{decryptError}</span>
                </div>
              )}

              {/* Decrypt Submit */}
              <Button
                type="submit"
                size="sm"
                className="w-full"
                isLoading={isDecrypting}
                leftIcon={<Unlock className="w-3.5 h-3.5" />}
                disabled={!decryptInput.trim() || !decryptPassword}
              >
                Decrypt & Authenticate
              </Button>

              {/* Decrypt Output */}
              {decryptResult !== null && (
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <span>Decrypted Plaintext</span>
                    {decryptTimeMs !== null && (
                      <span className="font-mono text-[10px]">{decryptTimeMs}ms</span>
                    )}
                  </div>

                  <div className="max-h-24 overflow-y-auto p-2 rounded bg-neutral-100 dark:bg-[#080B09] text-xs whitespace-pre-wrap select-all text-[#17251B] dark:text-[#F8FAFC]">
                    {decryptResult}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3 h-3" />}
                      onClick={() => downloadTextFile(decryptResult, 'securevault-decrypted.txt')}
                    >
                      Save TXT
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      leftIcon={copiedDecrypted ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      onClick={handleCopyDecryptedResult}
                    >
                      {copiedDecrypted ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: PASSWORD GENERATOR */}
          {activeTab === 'generator' && (
            <PasswordGenerator
              onSelectPassword={(pwd) => {
                setEncryptPassword(pwd);
                setActiveTab('encrypt');
                onNotify?.('Generated password applied to Encrypt tab', 'success');
              }}
              onCopyNotice={(msg) => onNotify?.(msg, 'info')}
            />
          )}

          {/* TAB 4: SETTINGS / QUICK CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#101612] space-y-2">
                <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC] block">
                  Active Cryptographic Engine
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#647067] dark:text-[#A1AAA4]">
                  <div>Cipher: AES-256-GCM</div>
                  <div>KDF: PBKDF2</div>
                  <div>Salt: 128-bit random</div>
                  <div>IV: 96-bit random</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#101612] space-y-2">
                <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC] block">
                  Privacy Policy
                </span>
                <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
                  100% in-browser processing. Zero telemetry or server calls. Passwords and plaintexts are never persisted to disk.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
                onClick={onSwitchToDashboard}
              >
                Open Full Dashboard
              </Button>
            </div>
          )}
        </div>

        {/* 4. Footer: Privacy Indicator */}
        <div className="p-2.5 border-t border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] flex items-center justify-between text-[11px] text-[#647067] dark:text-[#A1AAA4]">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-3 h-3" />
            <span>100% Client-Side</span>
          </div>

          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};
