/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Trash2,
  Shield,
  Sliders,
  CheckCircle2,
  Smartphone,
  Monitor,
  FileCheck,
  HardDrive,
} from 'lucide-react';
import {
  ALLOWED_ITERATION_OPTIONS,
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
  FILE_EXTENSION,
} from '../../config/encryptionConfig';
import { LayoutMode, ThemeMode } from '../../types/settings';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { GlassCard } from '../common/GlassCard';

export interface SettingsSectionProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  defaultIterations: number;
  onDefaultIterationsChange: (iterations: number) => void;
  recordHistory: boolean;
  onRecordHistoryChange: (enabled: boolean) => void;
  autoDownload: boolean;
  onAutoDownloadChange: (enabled: boolean) => void;
  onClearHistory: () => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToAbout?: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  theme,
  onThemeChange,
  layoutMode,
  onLayoutModeChange,
  defaultIterations,
  onDefaultIterationsChange,
  recordHistory,
  onRecordHistoryChange,
  autoDownload,
  onAutoDownloadChange,
  onClearHistory,
  onNotify,
  onNavigateToAbout,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          Settings
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          Configure interface appearance, cryptographic defaults, privacy rules, and file handling.
        </p>
      </div>

      {/* Section 1: Appearance & Layout */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Appearance & Workspace View
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#101612] text-white border-emerald-500 shadow-sm'
                    : 'bg-white/50 text-[#647067] border-[#DCE8DE] hover:border-emerald-500/40'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-emerald-800 border-emerald-600 shadow-sm'
                    : 'bg-neutral-100/50 text-[#647067] border-[#DCE8DE] hover:border-emerald-600/40'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Layout mode switcher */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Interface Layout Preview
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLayoutModeChange('dashboard')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'dashboard'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'border-[#DCE8DE] dark:border-emerald-500/15 text-[#647067] dark:text-[#A1AAA4]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Full Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => onLayoutModeChange('popup')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'popup'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'border-[#DCE8DE] dark:border-emerald-500/15 text-[#647067] dark:text-[#A1AAA4]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Extension Popup (390px)</span>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Section 2: Cryptographic Standards */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Cryptographic Engine Standards
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            NIST & OWASP Aligned
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D]">
              <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Symmetric Cipher</span>
              <span className="font-mono font-semibold text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                AES-256-GCM (256-bit)
              </span>
            </div>

            <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D]">
              <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Key Derivation</span>
              <span className="font-mono font-semibold text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                PBKDF2-HMAC-SHA256
              </span>
            </div>

            <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D]">
              <span className="text-[#647067] dark:text-[#A1AAA4] block text-[11px]">Container Format</span>
              <span className="font-mono font-semibold text-[#17251B] dark:text-emerald-400 mt-0.5 block">
                SecureVault Binary ({FILE_EXTENSION})
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-iterations-select"
              className="block font-medium text-[#17251B] dark:text-[#F8FAFC] mb-1.5"
            >
              Default PBKDF2 Iteration Count:
            </label>
            <select
              id="settings-iterations-select"
              value={defaultIterations}
              onChange={(e) => {
                const val = Number(e.target.value);
                onDefaultIterationsChange(val);
                onNotify?.(`Default iterations set to ${val.toLocaleString()}`, 'success');
              }}
              className="w-full text-xs rounded-lg border py-2 px-3 bg-white text-[#17251B] border-[#DCE8DE] focus:border-emerald-600 focus:outline-none dark:bg-[#0B100D] dark:text-[#F8FAFC] dark:border-emerald-500/20 dark:focus:border-emerald-500"
            >
              {ALLOWED_ITERATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Section 3: File Handling & Downloads */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            File Handling & Downloads
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDownload}
              onChange={(e) => onAutoDownloadChange(e.target.checked)}
              className="rounded accent-emerald-500 mt-0.5"
            />
            <div>
              <span className="font-medium text-[#17251B] dark:text-[#F8FAFC]">
                Auto-trigger download on single file completion
              </span>
              <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                Automatically prompt your browser to save the completed file upon successful operation.
              </p>
            </div>
          </label>

          <div className="p-3 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-medium text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Filename Sanitization Active
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Decrypted filenames are strictly sanitized before download to prevent directory traversal and filesystem injection risks.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Section 4: Privacy & History Management */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Privacy & History Management
          </h3>
        </div>

        <div className="space-y-3 text-xs text-[#647067] dark:text-[#A1AAA4]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={recordHistory}
              onChange={(e) => onRecordHistoryChange(e.target.checked)}
              className="rounded accent-emerald-500 mt-0.5"
            />
            <div>
              <span className="font-medium text-[#17251B] dark:text-[#F8FAFC]">
                Record session operational history
              </span>
              <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                Retains metadata (filename, size, timestamp) in volatile memory during your browser session. Disable for zero history retention.
              </p>
            </div>
          </label>

          <p className="leading-relaxed pt-2">
            SecureVault operates in-memory only. Files and passwords never touch remote servers, tracking services, or persistent browser storage.
          </p>

          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setShowClearConfirm(true)}
            >
              Purge Session Memory & History
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Section 5: Application Metadata */}
      <GlassCard className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-[#17251B] dark:text-[#F8FAFC]">
              {APP_NAME} <span className="text-xs font-mono font-normal opacity-70">v{APP_VERSION}</span>
            </h4>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5">
              {APP_TAGLINE}
            </p>
          </div>

          {onNavigateToAbout && (
            <Button variant="outline" size="sm" onClick={onNavigateToAbout}>
              About SecureVault
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onClearHistory();
          onNotify?.('Session file history purged', 'success');
        }}
        title="Purge Session Memory"
        message="This will immediately remove all file operational logs from temporary session memory."
        confirmLabel="Purge Everything"
        isDestructive
      />
    </div>
  );
};
