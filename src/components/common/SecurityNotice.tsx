/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, FileCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const SecurityNotice: React.FC = () => {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCE8DE] dark:border-emerald-500/15">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
          File Security & Cryptographic Standards
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Local In-Browser Processing
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Files are encrypted and decrypted directly in your browser using the native Web Crypto API. Your files never touch external servers or cloud services.
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
              Passwords, raw encryption keys, and file contents exist strictly in temporary memory during processing and are never saved to localStorage or disk.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Authenticated AES-256-GCM + PBKDF2
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Employs Galois/Counter Mode with 128-bit authentication tags, 96-bit random nonces, and PBKDF2 key derivation using SHA-256 and a 128-bit random salt.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#17251B] dark:text-[#F8FAFC]">
              Byte-for-Byte Restoration & Metadata Defense
            </p>
            <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5 leading-relaxed">
              Original filenames and MIME types are encrypted inside the container. Decryption recovers exact binary bytes only upon valid authentication tag verification.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
