/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileCheck,
} from 'lucide-react';
import { FileHistoryEntry } from '../../types/history';
import { formatFileSize } from '../../utils/fileSize';
import { formatTimestamp } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';

export interface HistoryListProps {
  entries: FileHistoryEntry[];
  onClear: () => void;
  onRemoveEntry: (id: string) => void;
  onLoadDemo?: () => void;
  onNavigateToEncrypt?: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  entries,
  onClear,
  onRemoveEntry,
  onLoadDemo,
  onNavigateToEncrypt,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC]">
            File History
          </h2>
          <p className="text-sm text-[#647067] dark:text-[#A1AAA4] mt-1">
            Privacy-preserving audit log of file cryptographic operations in this session.
          </p>
        </div>

        {entries.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setShowClearConfirm(true)}
          >
            Clear History
          </Button>
        )}
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-[#17251B] dark:text-[#E2E8F0] flex items-start gap-3">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">
            Strict Zero-Persistence Privacy Guarantee
          </p>
          <p className="text-[#647067] dark:text-[#A1AAA4] leading-relaxed">
            Plaintext file contents, decrypted data, and passwords are never persisted to disk or browser storage. Only operational metadata (filename, timestamp, size, and status) is retained in volatile memory during your active browser session.
          </p>
        </div>
      </div>

      {/* History List or Empty State */}
      {entries.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-6 h-6" />}
          title="No file encryption activity yet."
          description="Your recent file operations will appear here when enabled during this session. File contents and passwords are never recorded."
          actionLabel="Encrypt Your First File"
          onAction={onNavigateToEncrypt}
          secondaryActionLabel={onLoadDemo ? 'Load Demo Entries' : undefined}
          onSecondaryAction={onLoadDemo}
        />
      ) : (
        <GlassCard className="p-0 overflow-hidden divide-y divide-[#DCE8DE] dark:divide-emerald-500/15">
          <div className="p-4 bg-neutral-50/70 dark:bg-[#0E1410] flex items-center justify-between text-xs text-[#647067] dark:text-[#A1AAA4]">
            <span>Showing {entries.length} recorded session event{entries.length === 1 ? '' : 's'}</span>
            <span className="italic">Volatile Session Memory</span>
          </div>

          <div className="divide-y divide-[#DCE8DE] dark:divide-emerald-500/10">
            {entries.map((entry) => {
              const isEncrypt = entry.operation === 'encrypt';
              const isSuccess = entry.status === 'success';

              return (
                <div
                  key={entry.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 dark:hover:bg-[#16201A]/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isEncrypt
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {isEncrypt ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#17251B] dark:text-[#F8FAFC] truncate">
                          {entry.filename}
                        </span>
                        <span
                          className={`text-[11px] font-medium flex items-center gap-1 ${
                            isSuccess
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              {isEncrypt ? 'Encrypted' : 'Decrypted'}
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" /> Failed
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#647067] dark:text-[#A1AAA4]">
                        <span className="font-mono">{formatTimestamp(entry.timestamp)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.algorithm}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{formatFileSize(entry.fileSize)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{entry.executionTimeMs}ms</span>
                      </div>

                      {entry.errorMessage && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 italic">
                          {entry.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <IconButton
                    aria-label="Remove history entry"
                    title="Remove entry"
                    size="sm"
                    onClick={() => onRemoveEntry(entry.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-red-500" />
                  </IconButton>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={onClear}
        title="Clear File History"
        message="Are you sure you want to clear your current session file history? All operational logs will be permanently removed from memory."
        confirmLabel="Clear Log"
        isDestructive
      />
    </div>
  );
};
