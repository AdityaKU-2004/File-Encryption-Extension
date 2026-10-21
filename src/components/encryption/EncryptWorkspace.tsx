/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { ALLOWED_ITERATION_OPTIONS, FILE_EXTENSION, RECOMMENDED_MAX_FILE_SIZE } from '../../config/encryptionConfig';
import { useFileSelection } from '../../hooks/useFileSelection';
import { encryptFile } from '../../services/fileEncryptionService';
import { calculatePasswordStrength } from '../../services/passwordService';
import { FileHistoryEntry } from '../../types/history';
import { downloadBlob } from '../../utils/download';
import { formatFileSize } from '../../utils/fileSize';
import { getEncryptedFilename } from '../../utils/filename';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { Modal } from '../common/Modal';
import { BatchProgress } from '../files/BatchProgress';
import { FileDropZone } from '../files/FileDropZone';
import { FileList } from '../files/FileList';
import { PasswordGenerator } from '../password/PasswordGenerator';
import { PasswordInput } from '../password/PasswordInput';
import { PasswordStrength } from '../password/PasswordStrength';

export interface EncryptWorkspaceProps {
  onRecordHistory?: (entry: Omit<FileHistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
  defaultIterations?: number;
}

export const EncryptWorkspace: React.FC<EncryptWorkspaceProps> = ({
  onRecordHistory,
  onNotify,
  defaultIterations = 100_000,
}) => {
  const {
    selectedFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFileStatus,
    hasFiles,
    totalSizeBytes,
  } = useFileSelection('encrypt');

  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requireConfirm, setRequireConfirm] = useState(false);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [iterations, setIterations] = useState(defaultIterations);

  // Generator modal state
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [processedBytes, setProcessedBytes] = useState(0);

  // Validation errors
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Abort controller ref for batch cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const passwordStrength = calculatePasswordStrength(password);

  const handleApplyGeneratedPassword = (newPass: string) => {
    setPassword(newPass);
    if (requireConfirm) {
      setConfirmPassword(newPass);
    }
    setPasswordError(null);
    setShowGeneratorModal(false);
    onNotify?.('Cryptographic password applied to workspace', 'success');
  };

  const handleEncryptAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setGeneralError(null);

    if (!hasFiles) {
      setGeneralError('Please select at least one file to encrypt.');
      return;
    }

    if (!password) {
      setPasswordError('Password is required for encryption.');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (requireConfirm && password !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }

    setIsProcessing(true);
    setCompletedCount(0);
    setFailedCount(0);
    setProcessedBytes(0);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let successfulFiles = 0;
    let failedFiles = 0;
    let accumulatedBytes = 0;

    for (const item of selectedFiles) {
      if (abortController.signal.aborted) {
        updateFileStatus(item.id, { status: 'cancelled' });
        continue;
      }

      updateFileStatus(item.id, {
        status: 'encrypting',
        progress: 0,
        processedBytes: 0,
        errorMessage: undefined,
      });

      try {
        const result = await encryptFile({
          file: item.file,
          password,
          iterations,
          signal: abortController.signal,
          onProgress: (pBytes) => {
            updateFileStatus(item.id, {
              processedBytes: pBytes,
              progress: Math.round((pBytes / item.size) * 100),
            });
            setProcessedBytes(accumulatedBytes + pBytes);
          },
        });

        if (result.success && result.encryptedBlob) {
          successfulFiles++;
          setCompletedCount(successfulFiles);
          accumulatedBytes += item.size;
          setProcessedBytes(accumulatedBytes);

          updateFileStatus(item.id, {
            status: 'completed',
            progress: 100,
            processedBytes: item.size,
            encryptedBlob: result.encryptedBlob,
            executionTimeMs: result.executionTimeMs,
          });

          onRecordHistory?.({
            filename: item.name,
            operation: 'encrypt',
            status: 'success',
            timestamp: Date.now(),
            fileSize: item.size,
            executionTimeMs: result.executionTimeMs,
            algorithm: 'AES-256-GCM',
          });
        } else {
          failedFiles++;
          setFailedCount(failedFiles);

          updateFileStatus(item.id, {
            status: 'failed',
            errorMessage: result.error || 'Encryption failed.',
          });

          onRecordHistory?.({
            filename: item.name,
            operation: 'encrypt',
            status: 'failure',
            timestamp: Date.now(),
            fileSize: item.size,
            executionTimeMs: result.executionTimeMs,
            algorithm: 'AES-256-GCM',
            errorMessage: result.error,
          });
        }
      } catch (err) {
        failedFiles++;
        setFailedCount(failedFiles);
        updateFileStatus(item.id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Unexpected encryption error.',
        });
      }
    }

    setIsProcessing(false);
    abortControllerRef.current = null;

    if (successfulFiles > 0) {
      onNotify?.(
        `Successfully encrypted ${successfulFiles} file${successfulFiles === 1 ? '' : 's'} with AES-256-GCM`,
        'success'
      );
    }
  };

  const handleCancelBatch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      onNotify?.('Encryption batch cancelled by user', 'info');
    }
  };

  const handleDownloadAllEncrypted = () => {
    const completedItems = selectedFiles.filter((f) => f.status === 'completed' && f.encryptedBlob);
    for (const item of completedItems) {
      if (item.encryptedBlob) {
        downloadBlob(item.encryptedBlob, getEncryptedFilename(item.name));
      }
    }
    onNotify?.(`Triggered download for ${completedItems.length} encrypted files`, 'success');
  };

  const completedEncryptedCount = selectedFiles.filter(
    (f) => f.status === 'completed' && f.encryptedBlob
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          Encrypt Files
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          Select the files you want to protect. All files are encrypted locally in your browser with AES-256-GCM.
        </p>
      </div>

      <form onSubmit={handleEncryptAll} className="space-y-6">
        {/* A. File Selection Area */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <FileDropZone
            onFilesSelected={addFiles}
            title="Drop your files here"
            subtitle="or browse your device"
            buttonLabel="Select Files"
            disabled={isProcessing}
          />

          {/* Large file advisory if selected size exceeds 1.5GB */}
          {totalSizeBytes > RECOMMENDED_MAX_FILE_SIZE && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Total batch size is large ({formatFileSize(totalSizeBytes)}). In-browser memory is limited by your browser environment.
              </span>
            </div>
          )}

          {/* Selected File List */}
          <FileList
            files={selectedFiles}
            mode="encrypt"
            onRemove={removeFile}
            onClearAll={clearAllFiles}
            isProcessing={isProcessing}
            onNotify={onNotify}
          />
        </GlassCard>

        {/* B. Password & Key Derivation Card */}
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
              Encryption Password
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setShowGeneratorModal(true)}
              disabled={isProcessing}
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
              onClear={() => setPassword('')}
              error={passwordError || undefined}
              disabled={isProcessing}
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
                disabled={isProcessing}
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

        {/* C. Advanced Options */}
        <GlassCard className="p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="w-full flex items-center justify-between text-left cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
                Advanced Encryption Options
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
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Algorithm</span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    AES-256-GCM
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0B100D] border border-[#DCE8DE] dark:border-emerald-500/15">
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Key Derivation</span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    PBKDF2-HMAC-SHA256
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0B100D] border border-[#DCE8DE] dark:border-emerald-500/15">
                  <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Output Format</span>
                  <span className="font-mono font-medium text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                    SecureVault ({FILE_EXTENSION})
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="encrypt-iterations-select"
                  className="block font-medium text-[#17251B] dark:text-[#F8FAFC] mb-1.5"
                >
                  PBKDF2 Iteration Count:
                </label>
                <select
                  id="encrypt-iterations-select"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  disabled={isProcessing}
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

        {/* Batch Progress Bar */}
        {isProcessing && (
          <BatchProgress
            totalFiles={selectedFiles.length}
            completedFiles={completedCount}
            failedFiles={failedCount}
            processedBytes={processedBytes}
            totalBytes={totalSizeBytes}
            isProcessing={isProcessing}
            onCancel={handleCancelBatch}
          />
        )}

        {generalError && (
          <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-[#647067] dark:text-[#A1AAA4] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted locally in browser memory · Zero server uploads</span>
          </div>

          <div className="flex items-center gap-2">
            {completedEncryptedCount > 1 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadAllEncrypted}
              >
                Download All ({completedEncryptedCount})
              </Button>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isProcessing}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={!hasFiles || !password}
            >
              {isProcessing
                ? 'Encrypting Files...'
                : hasFiles
                ? `Encrypt ${selectedFiles.length} File${selectedFiles.length === 1 ? '' : 's'} (${formatFileSize(totalSizeBytes)})`
                : 'Encrypt Files'}
            </Button>
          </div>
        </div>
      </form>

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
