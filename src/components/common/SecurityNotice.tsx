/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const SecurityNotice: React.FC = () => {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCE8DE] dark:border-emerald-500/15">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
          Security & Cryptographic Standards
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Local Browser Execution
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Cryptographic keys and operations run directly in your browser session via Web Crypto API. No data or telemetry is sent to any remote server.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <KeyRound className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Zero-Persistence Password Policy
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Passwords and raw plaintext exist in component memory strictly for the active operation and are never written to disk, cookies, or storage.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              AES-256-GCM + PBKDF2
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Utilizes 256-bit Galois/Counter Mode with 128-bit authentication tag, 96-bit random IV, and PBKDF2 key derivation using HMAC-SHA-256.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Decryption Requirements
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Successful recovery requires the exact password. If a single character differs, the GCM authentication check will intentionally fail with zero plaintext leakage.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
