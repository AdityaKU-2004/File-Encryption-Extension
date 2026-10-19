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
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { GlassCard } from '../components/common/GlassCard';
import { SecurityNotice } from '../components/common/SecurityNotice';
import { HistoryEntry } from '../types/history';
import { ActivePage } from '../types/settings';
import { formatTimestamp } from '../utils/formatters';

export interface DashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  recentActivity: HistoryEntry[];
  onClearHistory: () => void;
  onLoadDemoHistory?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  recentActivity,
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
            <span>Client-Side Cryptography</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
            Your privacy starts here.
          </h1>

          <p className="text-sm sm:text-base text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
            Encrypt sensitive text locally and keep control of your data. Never sent to remote servers, never recorded to disk, and protected with AES-256-GCM.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="md"
              leftIcon={<Lock className="w-4 h-4" />}
              onClick={() => onNavigate('encrypt')}
            >
              Encrypt Text
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Unlock className="w-4 h-4" />}
              onClick={() => onNavigate('decrypt')}
            >
              Decrypt Text
            </Button>
          </div>
        </div>

        {/* Ambient subtle CSS visual element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      {/* B. Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#647067] dark:text-[#A1AAA4]">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1 */}
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
                  Encrypt Text
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Protect your text with password-based encryption using AES-256-GCM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Open workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>

          {/* Action 2 */}
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
                  Decrypt Text
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Recover text from a compatible encrypted message with your password.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Open workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>

          {/* Action 3 */}
          <GlassCard
            glow
            onClick={() => onNavigate('encrypt')}
            className="p-5 cursor-pointer group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#17251B] dark:text-[#F8FAFC]">
                  Secure Text
                </h3>
                <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-1 leading-relaxed">
                  Open the encryption workspace and prepare sensitive text for encryption.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Prepare message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* C. Security Information Card */}
      <SecurityNotice />

      {/* D. Recent Activity Section */}
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
            title="No encryption activity yet."
            description="Your recent activity will appear here when enabled. Plaintext and passwords are never recorded."
            actionLabel="Encrypt Text"
            onAction={() => onNavigate('encrypt')}
            secondaryActionLabel={onLoadDemoHistory ? 'Load Demo Activity' : undefined}
            onSecondaryAction={onLoadDemoHistory}
          />
        ) : (
          <GlassCard className="p-0 overflow-hidden divide-y divide-[#DCE8DE] dark:divide-emerald-500/15">
            {recentActivity.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="p-4 flex items-center justify-between text-xs hover:bg-neutral-50/50 dark:hover:bg-[#16201A]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {entry.operation === 'encrypt' ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold capitalize text-[#17251B] dark:text-[#F8FAFC]">
                      {entry.operation} Text
                    </span>
                    <span className="text-[#647067] dark:text-[#A1AAA4] ml-2 font-mono">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={
                      entry.status === 'success'
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-red-500 font-medium'
                    }
                  >
                    {entry.status === 'success' ? 'Verified' : 'Failed'}
                  </span>
                  <span className="text-[#647067] dark:text-[#A1AAA4] font-mono">
                    {entry.characterCount} chars
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
