/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Unlock,
  Copy,
  Download,
  Check,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { decryptionService } from '../../services/decryptionService';
import { HistoryEntry } from '../../types/history';
import { copyToClipboard, readFromClipboard } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';
import { validateAndParseEnvelope } from '../../utils/validation';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';
import { Textarea } from '../common/Textarea';
import { PasswordInput } from '../password/PasswordInput';

export interface DecryptWorkspaceProps {
  onRecordHistory?: (entry: Omit<HistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DecryptWorkspace: React.FC<DecryptWorkspaceProps> = ({
  onRecordHistory,
  onNotify,
}) => {
  // In-memory workspace state
  const [encryptedInput, setEncryptedInput] = useState('');
  const [password, setPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Decryption result state
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<{ algorithm: string; iterations: number } | null>(null);

  // Errors
  const [inputError, setInputError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Clipboard copy state
  const [copied, setCopied] = useState(false);

  const handlePasteEncrypted = async () => {
    const res = await readFromClipboard();
    if (res.success && res.text) {
      setEncryptedInput(res.text);
      setInputError(null);
      onNotify?.('Encrypted payload pasted from clipboard', 'info');
    } else if (res.error) {
      onNotify?.(res.error, 'error');
    }
  };

  const handleClearInput = () => {
    setEncryptedInput('');
    setInputError(null);
  };

  const handleClearPassword = () => {
    setPassword('');
    setPasswordError(null);
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setPasswordError(null);
    setGeneralError(null);
    setDecryptedText(null);

    // 1. Validate envelope input format
    const envelopeValidation = validateAndParseEnvelope(encryptedInput);
    if (!envelopeValidation.isValid) {
      setInputError(envelopeValidation.error || 'Invalid encrypted payload format.');
      return;
    }

    // 2. Validate password
    if (!password) {
      setPasswordError('Password is required to decrypt this message.');
      return;
    }

    setIsDecrypting(true);

    try {
      const result = await decryptionService.decrypt({
        encryptedText: encryptedInput,
        password,
      });

      if (result.success && result.decryptedText !== undefined) {
        setDecryptedText(result.decryptedText);
        setExecutionTimeMs(result.executionTimeMs);
        setMetadata({
          algorithm: result.envelopeMetadata?.algorithm || 'AES-256-GCM',
          iterations: result.envelopeMetadata?.iterations || 100_000,
        });

        onRecordHistory?.({
          operation: 'decrypt',
          status: 'success',
          timestamp: Date.now(),
          characterCount: encryptedInput.length,
          executionTimeMs: result.executionTimeMs,
          algorithm: result.envelopeMetadata?.algorithm || 'AES-256-GCM',
        });

        onNotify?.('Message successfully decrypted and authenticated', 'success');
      } else {
        setGeneralError(
          result.error ||
            'Decryption failed: The password may be incorrect, or the encrypted message was altered.'
        );

        onRecordHistory?.({
          operation: 'decrypt',
          status: 'failure',
          timestamp: Date.now(),
          characterCount: encryptedInput.length,
          executionTimeMs: result.executionTimeMs,
          algorithm: 'AES-256-GCM',
          errorMessage: result.error,
        });
      }
    } catch {
      setGeneralError('An unexpected error occurred during decryption.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopyDecrypted = async () => {
    if (!decryptedText) return;
    const res = await copyToClipboard(decryptedText);
    if (res.success) {
      setCopied(true);
      onNotify?.('Decrypted message copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadDecrypted = () => {
    if (!decryptedText) return;
    const res = downloadTextFile(decryptedText, 'securevault-decrypted.txt');
    if (res.success) {
      onNotify?.('Decrypted text saved as securevault-decrypted.txt', 'success');
    }
  };

  const handleClearOutput = () => {
    setDecryptedText(null);
    setExecutionTimeMs(null);
    setMetadata(null);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          Decrypt Text
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          Recover your original message using the password that was used to encrypt it.
        </p>
      </div>

      <form onSubmit={handleDecrypt} className="space-y-6">
        {/* Card 1: Encrypted Input */}
        <GlassCard className="p-5 sm:p-6 space-y-3">
          <Textarea
            label="Encrypted Payload"
            placeholder="Paste your SecureVault encrypted message here (e.g., SECUREVAULT:v1:...)..."
            value={encryptedInput}
            onChange={(e) => {
              setEncryptedInput(e.target.value);
              if (inputError) setInputError(null);
            }}
            onClear={handleClearInput}
            onPasteClipboard={handlePasteEncrypted}
            error={inputError || undefined}
            monospace
            rows={5}
            helperText="Expected format: SECUREVAULT:v1:<base64-payload>"
          />
        </GlassCard>

        {/* Card 2: Password Card */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
              Decryption Password
            </span>
          </div>

          <PasswordInput
            label="Password"
            placeholder="Enter the password used during encryption..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            onClear={handleClearPassword}
            error={passwordError || undefined}
            helperText="The password is required to derive the AES key and verify the GCM authentication tag."
          />
        </GlassCard>

        {generalError && (
          <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication or Decryption Error</p>
              <p className="mt-0.5 leading-relaxed">{generalError}</p>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#647067] dark:text-[#A1AAA4]">
            AES-256-GCM verification ensures zero plaintext leakage on password mismatch.
          </span>

          <Button
            type="submit"
            size="lg"
            isLoading={isDecrypting}
            leftIcon={<Unlock className="w-4 h-4" />}
            disabled={!encryptedInput.trim() || !password}
          >
            {isDecrypting ? 'Decrypting and Verifying...' : 'Decrypt Message'}
          </Button>
        </div>
      </form>

      {/* Decrypted Output Card - Only shown upon confirmed genuine cryptographic success */}
      {decryptedText !== null && (
        <GlassCard className="p-5 sm:p-6 space-y-4 border-emerald-500/30 dark:border-emerald-500/30">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Decrypted Original Message
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                  <span>{metadata?.algorithm || 'AES-256-GCM'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{decryptedText.length.toLocaleString()} characters</span>
                  {executionTimeMs !== null && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Clock className="w-3 h-3 inline" />
                        {executionTimeMs}ms
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <IconButton
                aria-label="Clear decrypted text"
                title="Clear output"
                size="sm"
                variant="danger"
                onClick={handleClearOutput}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="relative">
            <div className="w-full max-h-72 overflow-y-auto p-4 rounded-lg border bg-neutral-50 dark:bg-[#070A08] border-[#DCE8DE] dark:border-emerald-500/20 text-sm whitespace-pre-wrap leading-relaxed text-[#17251B] dark:text-[#F8FAFC] select-all">
              {decryptedText}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Authentication tag verified successfully</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadDecrypted}
              >
                Download as TXT
              </Button>

              <Button
                variant="primary"
                size="sm"
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={handleCopyDecrypted}
              >
                {copied ? 'Copied' : 'Copy Plaintext'}
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
