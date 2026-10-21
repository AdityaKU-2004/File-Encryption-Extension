/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Download,
  Trash2,
  Sun,
  Moon,
  Maximize2,
  AlertCircle,
  FileUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { APP_NAME, APP_VERSION, FILE_EXTENSION } from '../../config/encryptionConfig';
import { useFileSelection } from '../../hooks/useFileSelection';
import { decryptFile } from '../../services/fileDecryptionService';
import { encryptFile } from '../../services/fileEncryptionService';
import { calculatePasswordStrength } from '../../services/passwordService';
import { FileHistoryEntry } from '../../types/history';
import { ThemeMode } from '../../types/settings';
import { downloadBlob } from '../../utils/download';
import { FileIcon } from '../../utils/fileIcons';
import { formatFileSize } from '../../utils/fileSize';
import { getEncryptedFilename } from '../../utils/filename';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { FileProgress } from '../files/FileProgress';
import { PasswordGenerator } from '../password/PasswordGenerator';
import { PasswordInput } from '../password/PasswordInput';
import { PasswordStrength } from '../password/PasswordStrength';

export interface PopupLayoutProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSwitchToDashboard: () => void;
  onRecordHistory?: (entry: Omit<FileHistoryEntry, 'id'>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
  isStandalonePopup?: boolean;
}

type PopupTab = 'encrypt' | 'decrypt' | 'generator' | 'settings';

export const PopupLayout: React.FC<PopupLayoutProps> = ({
  theme,
  onToggleTheme,
  onSwitchToDashboard,
  onRecordHistory,
  onNotify,
  isStandalonePopup = false,
}) => {
  const [activeTab, setActiveTab] = useState<PopupTab>('encrypt');

  // Encryption tab state
  const encryptSelection = useFileSelection('encrypt');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptError, setEncryptError] = useState<string | null>(null);
  const encryptFileRef = useRef<HTMLInputElement>(null);

  // Decryption tab state
  const decryptSelection = useFileSelection('decrypt');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const decryptFileRef = useRef<HTMLInputElement>(null);

  const encryptStrength = calculatePasswordStrength(encryptPassword);

  // Run encryption
  const handleRunEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setEncryptError(null);

    if (encryptSelection.selectedFiles.length === 0) {
      setEncryptError('Please choose a file to encrypt.');
      return;
    }
    if (!encryptPassword) {
      setEncryptError('Password is required.');
      return;
    }
    if (encryptPassword.length < 8) {
      setEncryptError('Password must be at least 8 characters.');
      return;
    }

    setIsEncrypting(true);

    for (const item of encryptSelection.selectedFiles) {
      encryptSelection.updateFileStatus(item.id, {
        status: 'encrypting',
        progress: 0,
        processedBytes: 0,
      });

      try {
        const res = await encryptFile({
          file: item.file,
          password: encryptPassword,
          onProgress: (pBytes) => {
            encryptSelection.updateFileStatus(item.id, {
              processedBytes: pBytes,
              progress: Math.round((pBytes / item.size) * 100),
            });
          },
        });

        if (res.success && res.encryptedBlob) {
          encryptSelection.updateFileStatus(item.id, {
            status: 'completed',
            progress: 100,
            processedBytes: item.size,
            encryptedBlob: res.encryptedBlob,
            executionTimeMs: res.executionTimeMs,
          });

          onRecordHistory?.({
            filename: item.name,
            operation: 'encrypt',
            status: 'success',
            timestamp: Date.now(),
            fileSize: item.size,
            executionTimeMs: res.executionTimeMs,
            algorithm: 'AES-256-GCM',
          });

          onNotify?.(`Encrypted ${item.name} with AES-256-GCM`, 'success');
        } else {
          encryptSelection.updateFileStatus(item.id, {
            status: 'failed',
            errorMessage: res.error || 'Encryption failed.',
          });
        }
      } catch (err) {
        encryptSelection.updateFileStatus(item.id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Encryption failed.',
        });
      }
    }

    setIsEncrypting(false);
  };

  // Run decryption
  const handleRunDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecryptError(null);

    if (decryptSelection.selectedFiles.length === 0) {
      setDecryptError('Please choose an encrypted .svault file.');
      return;
    }
    if (!decryptPassword) {
      setDecryptError('Password is required.');
      return;
    }

    setIsDecrypting(true);

    for (const item of decryptSelection.selectedFiles) {
      decryptSelection.updateFileStatus(item.id, {
        status: 'decrypting',
        progress: 0,
        processedBytes: 0,
      });

      try {
        const res = await decryptFile({
          file: item.file,
          password: decryptPassword,
          onProgress: (pBytes) => {
            decryptSelection.updateFileStatus(item.id, {
              processedBytes: pBytes,
              progress: Math.round((pBytes / item.size) * 100),
            });
          },
        });

        if (res.success && res.decryptedBlob) {
          decryptSelection.updateFileStatus(item.id, {
            status: 'completed',
            progress: 100,
            processedBytes: item.size,
            decryptedBlob: res.decryptedBlob,
            recoveredFilename: res.originalFilename,
            recoveredMimeType: res.originalMimeType,
            executionTimeMs: res.executionTimeMs,
          });

          onRecordHistory?.({
            filename: res.originalFilename || item.name,
            operation: 'decrypt',
            status: 'success',
            timestamp: Date.now(),
            fileSize: res.originalSize || item.size,
            executionTimeMs: res.executionTimeMs,
            algorithm: 'AES-256-GCM',
          });

          onNotify?.(`Decrypted and restored ${res.originalFilename}`, 'success');
        } else {
          decryptSelection.updateFileStatus(item.id, {
            status: 'failed',
            errorMessage:
              res.error ||
              'Decryption failed. The password may be incorrect, or the file may be corrupted.',
          });
        }
      } catch (err) {
        decryptSelection.updateFileStatus(item.id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Decryption failed.',
        });
      }
    }

    setIsDecrypting(false);
  };

  const popupContent = (
    <div
      className={`w-full max-w-[400px] ${
        isStandalonePopup
          ? 'rounded-none border-0 shadow-none min-h-[520px]'
          : 'rounded-2xl border border-[#DCE8DE] dark:border-emerald-500/20 shadow-2xl'
      } bg-white dark:bg-[#080B09] overflow-hidden flex flex-col`}
    >
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
          {/* TAB 1: ENCRYPT FILES */}
          {activeTab === 'encrypt' && (
            <form onSubmit={handleRunEncrypt} className="space-y-3.5">
              <input
                ref={encryptFileRef}
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) encryptSelection.addFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />

              {/* File selector or current file card */}
              {encryptSelection.selectedFiles.length === 0 ? (
                <div
                  onClick={() => encryptFileRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-[#DCE8DE] dark:border-emerald-500/20 bg-neutral-50/50 dark:bg-[#0B100D] text-center cursor-pointer hover:border-emerald-500/40 transition-colors"
                >
                  <FileUp className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
                    Choose files to encrypt
                  </p>
                  <p className="text-[10px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                    Videos, documents, spreadsheets, images, archives
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                      {encryptSelection.selectedFiles.length} file{encryptSelection.selectedFiles.length === 1 ? '' : 's'} ({formatFileSize(encryptSelection.totalSizeBytes)})
                    </span>
                    <button
                      type="button"
                      onClick={encryptSelection.clearAllFiles}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {encryptSelection.selectedFiles.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50/50 dark:bg-[#0B100D] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileIcon category={item.category} size="sm" />
                        <span className="truncate max-w-[170px] text-[#17251B] dark:text-[#F8FAFC]">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-[#647067] dark:text-[#A1AAA4]">
                          {formatFileSize(item.size)}
                        </span>
                        {item.status === 'completed' && item.encryptedBlob && (
                          <IconButton
                            aria-label="Download encrypted file"
                            size="sm"
                            onClick={() => downloadBlob(item.encryptedBlob!, getEncryptedFilename(item.name))}
                          >
                            <Download className="w-3 h-3 text-emerald-500" />
                          </IconButton>
                        )}
                        {item.status === 'idle' && (
                          <IconButton
                            aria-label="Remove file"
                            size="sm"
                            onClick={() => encryptSelection.removeFile(item.id)}
                          >
                            <Trash2 className="w-3 h-3 text-neutral-400 hover:text-red-500" />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  ))}

                  {encryptSelection.selectedFiles.length > 3 && (
                    <p className="text-[10px] text-center text-[#647067] dark:text-[#A1AAA4]">
                      + {encryptSelection.selectedFiles.length - 3} more files
                    </p>
                  )}
                </div>
              )}

              {/* Password */}
              <PasswordInput
                label="Password"
                placeholder="Enter encryption password..."
                value={encryptPassword}
                onChange={(e) => {
                  setEncryptPassword(e.target.value);
                  if (encryptError) setEncryptError(null);
                }}
                onClear={() => setEncryptPassword('')}
                disabled={isEncrypting}
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

              <Button
                type="submit"
                size="sm"
                className="w-full"
                isLoading={isEncrypting}
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                disabled={!encryptSelection.hasFiles || !encryptPassword}
              >
                {isEncrypting ? 'Encrypting with AES-GCM...' : 'Encrypt Files'}
              </Button>
            </form>
          )}

          {/* TAB 2: DECRYPT FILES */}
          {activeTab === 'decrypt' && (
            <form onSubmit={handleRunDecrypt} className="space-y-3.5">
              <input
                ref={decryptFileRef}
                type="file"
                multiple
                accept=".svault,*/*"
                onChange={(e) => {
                  if (e.target.files) decryptSelection.addFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />

              {/* File selector or current file card */}
              {decryptSelection.selectedFiles.length === 0 ? (
                <div
                  onClick={() => decryptFileRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-[#DCE8DE] dark:border-emerald-500/20 bg-neutral-50/50 dark:bg-[#0B100D] text-center cursor-pointer hover:border-emerald-500/40 transition-colors"
                >
                  <Unlock className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
                    Choose .svault files
                  </p>
                  <p className="text-[10px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                    Select encrypted SecureVault containers
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                      {decryptSelection.selectedFiles.length} encrypted file{decryptSelection.selectedFiles.length === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button"
                      onClick={decryptSelection.clearAllFiles}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {decryptSelection.selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50/50 dark:bg-[#0B100D] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileIcon category={item.category} size="sm" />
                          <span className="truncate max-w-[170px] text-[#17251B] dark:text-[#F8FAFC]">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.status === 'completed' && item.decryptedBlob && (
                            <IconButton
                              aria-label="Download recovered file"
                              size="sm"
                              onClick={() => downloadBlob(item.decryptedBlob!, item.recoveredFilename || 'recovered_file')}
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-500" />
                            </IconButton>
                          )}
                          {item.status === 'idle' && (
                            <IconButton
                              aria-label="Remove file"
                              size="sm"
                              onClick={() => decryptSelection.removeFile(item.id)}
                            >
                              <Trash2 className="w-3 h-3 text-neutral-400 hover:text-red-500" />
                            </IconButton>
                          )}
                        </div>
                      </div>

                      {item.recoveredFilename && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Restored: {item.recoveredFilename}
                        </p>
                      )}

                      {item.errorMessage && (
                        <p className="text-[11px] text-red-500">
                          {item.errorMessage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Password */}
              <PasswordInput
                label="Password"
                placeholder="Enter decryption password..."
                value={decryptPassword}
                onChange={(e) => {
                  setDecryptPassword(e.target.value);
                  if (decryptError) setDecryptError(null);
                }}
                onClear={() => setDecryptPassword('')}
                disabled={isDecrypting}
              />

              {decryptError && (
                <div className="p-2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{decryptError}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                className="w-full"
                isLoading={isDecrypting}
                leftIcon={<Unlock className="w-3.5 h-3.5" />}
                disabled={!decryptSelection.hasFiles || !decryptPassword}
              >
                {isDecrypting ? 'Decrypting and Authenticating...' : 'Decrypt Files'}
              </Button>
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
                  <div>KDF: PBKDF2 (SHA-256)</div>
                  <div>Format: .svault</div>
                  <div>Salt: 128-bit random</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#101612] space-y-2">
                <span className="font-semibold text-[#17251B] dark:text-[#F8FAFC] block">
                  Privacy Policy
                </span>
                <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
                  100% in-browser processing. Zero telemetry or server calls. Passwords and file contents are never persisted to disk.
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
  );

  if (isStandalonePopup) {
    return popupContent;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-neutral-200/50 dark:bg-neutral-950/40">
      {popupContent}
    </div>
  );
};
