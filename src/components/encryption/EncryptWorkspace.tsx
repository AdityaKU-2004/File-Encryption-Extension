/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ALLOWED_ITERATION_OPTIONS } from '../../config/encryptionConfig';
import { encryptionService } from '../../services/encryptionService';
import { calculatePasswordStrength } from '../../services/passwordService';
import { HistoryEntry } from '../../types/history';
import { readFromClipboard } from '../../utils/clipboard';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { PasswordGenerator } from '../password/PasswordGenerator';
import { PasswordInput } from '../password/PasswordInput';
import { PasswordStrength } from '../password/PasswordStrength';
import { EncryptionOutput } from './EncryptionOutput';

export interface EncryptWorkspaceProps {
  onRecordHistory?: (entry: Omit<HistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
  defaultIterations?: number;
}

export const EncryptWorkspace: React.FC<EncryptWorkspaceProps> = ({
  onRecordHistory,
  onNotify,
  defaultIterations = 100_000,
}) => {
  // Ephemeral in-memory state only - never written to persistent storage
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requireConfirm, setRequireConfirm] = useState(false);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [iterations, setIterations] = useState(defaultIterations);

  // Generator modal state
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Execution state
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<{
    encryptedText: string;
    executionTimeMs: number;
    algorithm: string;
  } | null>(null);

  // Validation errors
  const [plaintextError, setPlaintextError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const passwordStrength = calculatePasswordStrength(password);

  const handlePastePlaintext = async () => {
    const res = await readFromClipboard();
    if (res.success && res.text) {
      setPlaintext(res.text);
      setPlaintextError(null);
      onNotify?.('Text pasted from clipboard', 'info');
    } else if (res.error) {
      onNotify?.(res.error, 'error');
    }
  };

  const handleClearPlaintext = () => {
    setPlaintext('');
    setPlaintextError(null);
  };

  const handleClearPassword = () => {
    setPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleApplyGeneratedPassword = (newPass: string) => {
    setPassword(newPass);
    if (requireConfirm) {
      setConfirmPassword(newPass);
    }
    setPasswordError(null);
    setShowGeneratorModal(false);
    onNotify?.('Cryptographic password applied to workspace', 'success');
  };

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlaintextError(null);
    setPasswordError(null);
    setGeneralError(null);

    // Validation
    let hasError = false;
    if (!plaintext.trim()) {
      setPlaintextError('Please enter text to encrypt.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required for encryption.');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      hasError = true;
    }

    if (requireConfirm && password !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      hasError = true;
    }

    if (hasError) return;

    setIsEncrypting(true);

    try {
      const result = await encryptionService.encrypt({
        plaintext,
        password,
        iterations,
      });

      if (result.success) {
        setEncryptionResult({
          encryptedText: result.encryptedText,
          executionTimeMs: result.executionTimeMs,
          algorithm: 'AES-256-GCM',
        });

        // Record strictly non-sensitive operational metadata
        onRecordHistory?.({
          operation: 'encrypt',
          status: 'success',
          timestamp: Date.now(),
          characterCount: plaintext.length,
          executionTimeMs: result.executionTimeMs,
          algorithm: 'AES-256-GCM',
        });

        onNotify?.('Message successfully encrypted locally with AES-256-GCM', 'success');
      } else {
        setGeneralError(result.error || 'Encryption failed.');
        onRecordHistory?.({
          operation: 'encrypt',
          status: 'failure',
          timestamp: Date.now(),
          characterCount: plaintext.length,
          executionTimeMs: result.executionTimeMs,
          algorithm: 'AES-256-GCM',
          errorMessage: result.error,
        });
      }
    } catch {
      setGeneralError('An unexpected error occurred during encryption.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleResetOutput = () => {
    setEncryptionResult(null);
    setGeneralError(null);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          Encrypt Text
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          Protect your message with password-based encryption using authenticated AES-256-GCM.
        </p>
      </div>

      <form onSubmit={handleEncrypt} className="space-y-6">
        {/* Card 1: Text Input */}
        <GlassCard className="p-5 sm:p-6 space-y-3">
          <Textarea
            label="Plaintext Input"
            placeholder="Enter the text you want to encrypt..."
            value={plaintext}
            onChange={(e) => {
              setPlaintext(e.target.value);
              if (plaintextError) setPlaintextError(null);
            }}
            onClear={handleClearPlaintext}
            onPasteClipboard={handlePastePlaintext}
            error={plaintextError || undefined}
            rows={5}
            helperText="Your text remains strictly in local memory and is never logged or transmitted."
          />
        </GlassCard>

        {/* Card 2: Password & Key Settings */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
              Encryption Key & Password
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setShowGeneratorModal(true)}
            >
              Generate Strong Password
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              label="Password"
              placeholder="Enter strong encryption password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              onClear={handleClearPassword}
              error={passwordError || undefined}
            />

            {requireConfirm ? (
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter password to verify..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onClear={() => setConfirmPassword('')}
                error={
                  confirmPassword && password !== confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
              />
            ) : (
              <div className="flex flex-col justify-end pb-1.5">
                <button
                  type="button"
                  onClick={() => setRequireConfirm(true)}
                  className="text-xs text-left text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  + Enable password confirmation check
                </button>
              </div>
            )}
          </div>

          {password && <PasswordStrength strength={passwordStrength} />}
        </GlassCard>

        {/* Card 3: Advanced Cryptographic Parameters (Collapsible) */}
        <GlassCard className="p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="w-full flex items-center justify-between text-left cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
                Advanced Cryptographic Options
              </span>
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="pt-4 mt-3 border-t border-[#DCE8DE] dark:border-emerald-500/15 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0B100D] border border-[#DCE8DE] dark:border-emerald-500/15">
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">
                    Cipher Algorithm
                  </span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    AES-256-GCM
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0B100D] border border-[#DCE8DE] dark:border-emerald-500/15">
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">
                    Key Derivation (KDF)
                  </span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    PBKDF2-HMAC-SHA256
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0B100D] border border-[#DCE8DE] dark:border-emerald-500/15">
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">
                    Output Container
                  </span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    SecureVault Envelope v1
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="kdf-iterations-select"
                  className="block font-medium text-[#17251B] dark:text-[#F8FAFC] mb-1.5"
                >
                  PBKDF2 Iteration Count:
                </label>
                <select
                  id="kdf-iterations-select"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border py-2 px-3 bg-white text-[#17251B] border-[#DCE8DE] focus:border-emerald-600 focus:outline-none dark:bg-[#0B100D] dark:text-[#F8FAFC] dark:border-emerald-500/20 dark:focus:border-emerald-500"
                >
                  {ALLOWED_ITERATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] mt-1">
                  Higher iterations increase computational resistance against dictionary brute-force attacks.
                </p>
              </div>
            </div>
          )}
        </GlassCard>

        {generalError && (
          <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#647067] dark:text-[#A1AAA4] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted locally in browser memory</span>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isEncrypting}
            leftIcon={<Lock className="w-4 h-4" />}
            disabled={!plaintext.trim() || !password}
          >
            {isEncrypting ? 'Encrypting with AES-GCM...' : 'Encrypt Text'}
          </Button>
        </div>
      </form>

      {/* Result Output Card */}
      {encryptionResult && (
        <EncryptionOutput
          encryptedText={encryptionResult.encryptedText}
          executionTimeMs={encryptionResult.executionTimeMs}
          algorithm={encryptionResult.algorithm}
          onClear={handleResetOutput}
          onNotify={(msg) => onNotify?.(msg, 'success')}
        />
      )}

      {/* Password Generator Modal */}
      <Modal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        title="Password Generator"
        description="Generate a cryptographically secure random password using Web Crypto."
        maxWidth="md"
      >
        <PasswordGenerator
          onSelectPassword={handleApplyGeneratedPassword}
          onCopyNotice={(msg) => onNotify?.(msg, 'info')}
        />
      </Modal>
    </div>
  );
};
