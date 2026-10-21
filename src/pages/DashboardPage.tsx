/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Lock,
  Unlock,
  Shield,
  FileCheck,
  ArrowRight,
  Clock,
  HardDrive,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { GlassCard } from '../components/common/GlassCard';
import { SecurityNotice } from '../components/common/SecurityNotice';
import { FileHistoryEntry } from '../types/history';
import { ActivePage } from '../types/settings';
import { formatFileSize } from '../../src/utils/fileSize';
import { formatTimestamp } from '../utils/formatters';

export interface DashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  recentActivity: FileHistoryEntry[];
  stats: {
    totalProcessed: number;
    totalEncrypted: number;
    totalDecrypted: number;
    totalFailed: number;
  };
  onClearHistory: () => void;
  onLoadDemoHistory?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  recentActivity,
  stats,
  onClearHistory,
  onLoadDemoHistory,
}) => {
  return (
    <div className="space-y-8">
      {/* A. Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-neutral-900/10 to-transparent p-6 sm:p-10 backdrop-blur-md">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Local Browser File Cryptography</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
            Your files deserve better protection.
          </h1>

          <p className="text-sm sm:text-base text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
            Encrypt documents, videos, images, and more — directly in your browser. Restores original files byte-for-byte upon decryption, with zero cloud uploads.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="md"
              leftIcon={<Lock className="w-4 h-4" />}
              onClick={() => onNavigate('encrypt')}
            >
              Encrypt Files
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Unlock className="w-4 h-4" />}
              onClick={() => onNavigate('decrypt')}
            >
              Decrypt Files
            </Button>
          </div>
        </div>

        {/* Subtle CSS ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      {/* B. Real Session File Statistics */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4] mb-3">
          Session Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] text-[#647067] dark:text-[#A1AAA4] block">
              Files Processed
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#17251B] dark:text-[#F8FAFC]">
              {stats.totalProcessed}
            </span>
            <span className="text-[10px] text-[#647067] dark:text-[#64746B] block">
              Current Session
            </span>
          </GlassCard>

          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] text-[#647067] dark:text-[#A1AAA4] block">
              Encrypted
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.totalEncrypted}
            </span>
            <span className="text-[10px] text-[#647067] dark:text-[#64746B] block">
              .svault Containers
            </span>
          </GlassCard>

          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] text-[#647067] dark:text-[#A1AAA4] block">
              Decrypted
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.totalDecrypted}
            </span>
            <span className="text-[10px] text-[#647067] dark:text-[#64746B] block">
              Restored Byte-for-Byte
            </span>
          </GlassCard>

          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] text-[#647067] dark:text-[#A1AAA4] block">
              Engine Status
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
            <span className="text-[10px] text-[#647067] dark:text-[#64746B] block">
              AES-256-GCM / PBKDF2
            </span>
          </GlassCard>
        </div>
      </div>

      {/* C. Quick Action Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4] mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard
            glow
            onClick={() => onNavigate('encrypt')}
            className="p-5 cursor-pointer group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                  Encrypt Files
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Protect documents, videos, images, and archives with password-derived AES-256-GCM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Open workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>

          <GlassCard
            glow
            onClick={() => onNavigate('decrypt')}
            className="p-5 cursor-pointer group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                  Decrypt Files
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Recover your original files byte-for-byte from .svault containers using your password.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Open workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>

          <GlassCard
            glow
            onClick={() => onNavigate('about')}
            className="p-5 cursor-pointer group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                  File Security
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Learn how local file encryption, authenticated metadata, and PBKDF2 protect your data.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>View architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* D. Security Standards Overview */}
      <SecurityNotice />

      {/* E. Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4]">
              Recent Activity
            </h2>
          </div>

          {recentActivity.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              View full audit log ({recentActivity.length})
            </button>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-5 h-5" />}
            title="No file encryption activity yet."
            description="Your recent file operations will appear here when enabled. File contents and passwords are never recorded."
            actionLabel="Encrypt Files"
            onAction={() => onNavigate('encrypt')}
            secondaryActionLabel={onLoadDemoHistory ? 'Load Demo Activity' : undefined}
            onSecondaryAction={onLoadDemoHistory}
          />
        ) : (
          <GlassCard className="p-0 overflow-hidden divide-y divide-[#DCE8DE] dark:divide-emerald-500/15">
            {recentActivity.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="p-4 flex items-center justify-between text-xs hover:bg-neutral-50/50 dark:hover:bg-[#16201A]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                    {entry.operation === 'encrypt' ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#17251B] dark:text-[#F8FAFC] truncate">
                      {entry.filename}
                    </p>
                    <div className="flex items-center gap-2 text-[#647067] dark:text-[#A1AAA4] text-[11px] font-mono">
                      <span>{formatTimestamp(entry.timestamp)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatFileSize(entry.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={
                      entry.status === 'success'
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-red-500 font-medium'
                    }
                  >
                    {entry.status === 'success'
                      ? entry.operation === 'encrypt'
                        ? 'Encrypted'
                        : 'Decrypted'
                      : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
