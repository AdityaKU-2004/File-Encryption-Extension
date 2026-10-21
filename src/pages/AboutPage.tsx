/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Globe,
  Terminal,
  AlertTriangle,
  HardDrive,
  FileCheck2,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_VERSION, FILE_EXTENSION } from '../config/encryptionConfig';
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
            Privacy-First File Cryptography
          </h3>
        </div>

        <p className="text-sm text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          {APP_NAME} is an offline-capable, cross-browser file encryption utility engineered for browser extension environments (Google Chrome, Mozilla Firefox, and Chromium-based browsers). It enables individuals to encrypt sensitive documents, videos, spreadsheets, presentations, archives, and arbitrary binary files directly within the local browser sandbox without uploading data to remote servers or third-party cloud infrastructure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Zero Telemetry
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              No files, file contents, or usage telemetry are ever transmitted across networks.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Zero Persistence
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Passwords and raw file buffers reside exclusively in memory during the operation.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 bg-neutral-50 dark:bg-[#0B100D] space-y-1">
            <span className="font-semibold text-xs text-[#17251B] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Byte-for-Byte Fidelity
            </span>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Decryption restores the exact binary byte sequence and original filename.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Cryptographic Specifications */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Cryptographic Protocol & Binary Container Specification
          </h3>
        </div>

        <div className="space-y-3 text-xs text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          <p>
            SecureVault files use a standardized binary container format (<code className="font-mono text-emerald-600 dark:text-emerald-400">{FILE_EXTENSION}</code>) designed for high integrity and tamper resistance:
          </p>

          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Symmetric Cipher:</strong> AES-GCM (Galois/Counter Mode) with 256-bit key length and 128-bit authentication tags.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Key Derivation:</strong> PBKDF2-HMAC-SHA256 with 100,000+ iterations and a unique 128-bit cryptographically random salt per file.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Separate Initialization Vectors:</strong> Dedicated 96-bit random IVs for metadata and file payload, ensuring zero nonce reuse.
            </li>
            <li>
              <strong className="text-[#17251B] dark:text-[#F8FAFC]">Authenticated Metadata:</strong> Original filenames, file sizes, and MIME types are encrypted and authenticated inside the container, preventing eavesdropping and tampering.
            </li>
          </ul>
        </div>
      </GlassCard>

      {/* Limitations and Disclosures */}
      <GlassCard className="p-5 sm:p-6 space-y-4 border-amber-500/30 dark:border-amber-500/30">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#17251B] dark:text-[#F8FAFC]">
            Security Disclosures & Technical Limitations
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong>Browser Memory Constraints:</strong> Processing occurs in-browser. Operating systems and browsers typically limit single memory allocations to 1.5GB–2GB.
            </li>
            <li>
              <strong>No Password Recovery Backdoor:</strong> Decryption mathematically depends on the password. There is no recovery mechanism or master key. If a password is forgotten, ciphertext cannot be recovered.
            </li>
            <li>
              <strong>Host Device Security:</strong> If the user's operating system or browser is infected with malware or spyware, files can be intercepted before encryption or after decryption.
            </li>
          </ul>
        </div>
      </GlassCard>

      {/* Version badge */}
      <div className="text-center text-xs text-[#647067] dark:text-[#A1AAA4] py-2">
        <span>{APP_NAME} v{APP_VERSION}</span>
        <span aria-hidden="true" className="mx-2">·</span>
        <span>Cross-Browser File Encryption Extension</span>
      </div>
    </div>
  );
};
