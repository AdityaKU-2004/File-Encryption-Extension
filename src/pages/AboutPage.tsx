/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  FileCode2,
  AlertTriangle,
  Globe,
  Terminal,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '../config/encryptionConfig';
import { GlassCard } from '../components/common/GlassCard';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
          About {APP_NAME}
        </h2>
        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
          {APP_TAGLINE}
        </p>
      </div>

      {/* Mission & Principles */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Privacy-First Architecture
          </h3>
        </div>

        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          {APP_NAME} is an offline-capable, client-side encryption utility engineered for browser extension environments (Chrome, Firefox, and Chromium variants). It empowers individuals to protect sensitive snippets, notes, and messages locally without relying on centralized third-party servers, accounts, or proprietary cloud algorithms.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Zero Telemetry
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              No analytics scripts, tracking beacons, or external API endpoints are ever contacted.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Zero Persistence
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Passwords and raw plaintext remain strictly in volatile memory during your session.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" /> Web Crypto Native
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Executes using the browser's hardware-accelerated SubtleCrypto standard implementation.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Cryptographic Specifications */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Cryptographic Protocol & Format Specification
          </h3>
        </div>

        <div className="space-y-3 text-xs text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          <p>
            Messages encrypted with {APP_NAME} use authenticated symmetric encryption that guards against both eavesdropping and unauthorized tampering:
          </p>

          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Cipher:</strong> AES-GCM (Galois/Counter Mode) with 256-bit key length and 128-bit authentication tag.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Key Derivation:</strong> PBKDF2-HMAC-SHA256 using 100,000+ iterations and a unique 128-bit cryptographically random salt per message.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Initialization Vector (IV):</strong> Unique 96-bit random IV generated via <code className="font-mono text-emerald-600 dark:text-emerald-400">crypto.getRandomValues</code> for every encryption operation.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Envelope Serialization:</strong> Serialized as a versioned Base64 envelope prefixed with <code className="font-mono text-emerald-600 dark:text-emerald-400">SECUREVAULT:v1:</code> containing JSON metadata for interoperability.
            </li>
          </ul>
        </div>
      </GlassCard>

      {/* Limitations and Disclosures */}
      <GlassCard className="p-5 sm:p-6 space-y-4 border-amber-500/30 dark:border-amber-500/30">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Security Disclosures & Threat Model Limitations
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          <p>
            To maintain transparency and informed trust, please note the operational boundaries of this tool:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong>Plaintext Visibility:</strong> While plaintext is displayed on your monitor, anyone with physical or visual access to your screen may read it. Clear the screen when finished.
            </li>
            <li>
              <strong>Host Environment Security:</strong> If your underlying operating system, browser, or device is compromised with malware or keyloggers, encryption cannot protect data entered into input fields.
            </li>
            <li>
              <strong>Password Strength & Recovery:</strong> Decryption mathematically depends on the password. There is no backdoor, master key, or recovery mechanism. If a password is forgotten, ciphertext cannot be recovered.
            </li>
            <li>
              <strong>Audit Status:</strong> SecureVault relies on the browser's native Web Crypto API standard primitives; however, no independent third-party code audit has been performed on this build.
            </li>
          </ul>
        </div>
      </GlassCard>

      {/* Version badge */}
      <div className="text-center text-xs text-[#647067] dark:text-[#A1AAA4] py-2">
        <span>{APP_NAME} v{APP_VERSION}</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Cross-Browser Web Crypto Extension</span>
      </div>
    </div>
  );
};
