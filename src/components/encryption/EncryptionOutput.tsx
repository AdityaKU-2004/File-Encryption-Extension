/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Download, Check, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';

export interface EncryptionOutputProps {
  encryptedText: string;
  executionTimeMs?: number;
  algorithm?: string;
  onClear: () => void;
  onNotify?: (message: string) => void;
}

export const EncryptionOutput: React.FC<EncryptionOutputProps> = ({
  encryptedText,
  executionTimeMs,
  algorithm = 'AES-256-GCM',
  onClear,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const res = await copyToClipboard(encryptedText);
    if (res.success) {
      setCopied(true);
      onNotify?.('Encrypted payload copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const res = downloadTextFile(encryptedText, 'securevault-encrypted.txt');
    if (res.success) {
      onNotify?.('Encrypted payload downloaded as securevault-encrypted.txt');
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-emerald-500/30 dark:border-emerald-500/30">
      {/* Success banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCE8DE] dark:border-emerald-500/15">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Encrypted Payload Ready
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-[#647067] dark:text-[#A1AAA4] mt-0.5">
              <span>{algorithm}</span>
              <span aria-hidden="true">·</span>
              <span>{encryptedText.length.toLocaleString()} characters</span>
              {executionTimeMs !== undefined && (
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
            aria-label="Clear encrypted output"
            title="Clear output"
            size="sm"
            variant="danger"
            onClick={onClear}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </div>

      {/* Ciphertext monospace display */}
      <div className="relative">
        <div className="w-full max-h-56 overflow-y-auto p-3.5 rounded-lg border bg-neutral-50 dark:bg-[#070A08] border-[#DCE8DE] dark:border-emerald-500/20 font-mono text-xs break-all leading-relaxed text-[#17251B] dark:text-[#E2E8F0] select-all">
          {encryptedText}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-[#647067] dark:text-[#A1AAA4]">
          Format: <code className="font-mono text-emerald-700 dark:text-emerald-400">SECUREVAULT:v1</code> (Base64 Envelope)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
          >
            Download TXT
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Payload'}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
