/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { FileHistoryEntry } from '../types/history';

export function useHistory() {
  // Empty state by default as required by specification
  const [history, setHistory] = useState<FileHistoryEntry[]>([]);

  const addEntry = useCallback((entry: Omit<FileHistoryEntry, 'id'>) => {
    const newEntry: FileHistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 in volatile RAM
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadDemoData = useCallback(() => {
    const now = Date.now();
    const demoEntries: FileHistoryEntry[] = [
      {
        id: 'demo-1',
        filename: 'project-proposal.docx',
        operation: 'encrypt',
        status: 'success',
        timestamp: now - 1000 * 60 * 18,
        fileSize: 2_450_000, // 2.4 MB
        executionTimeMs: 142,
        algorithm: 'AES-256-GCM',
      },
      {
        id: 'demo-2',
        filename: 'product_walkthrough.mp4',
        operation: 'encrypt',
        status: 'success',
        timestamp: now - 1000 * 60 * 45,
        fileSize: 48_200_000, // 48.2 MB
        executionTimeMs: 480,
        algorithm: 'AES-256-GCM',
      },
      {
        id: 'demo-3',
        filename: 'financial_records.xlsx.svault',
        operation: 'decrypt',
        status: 'success',
        timestamp: now - 1000 * 60 * 90,
        fileSize: 850_000, // 850 KB
        executionTimeMs: 68,
        algorithm: 'AES-256-GCM',
      },
      {
        id: 'demo-4',
        filename: 'corrupted_backup.svault',
        operation: 'decrypt',
        status: 'failure',
        timestamp: now - 1000 * 60 * 130,
        fileSize: 12_000_000,
        executionTimeMs: 32,
        algorithm: 'AES-256-GCM',
        errorMessage: 'Authentication failed: Incorrect password or container modified.',
      },
    ];
    setHistory(demoEntries);
  }, []);

  // Compute real statistics from session history
  const stats = {
    totalProcessed: history.length,
    totalEncrypted: history.filter((h) => h.operation === 'encrypt' && h.status === 'success').length,
    totalDecrypted: history.filter((h) => h.operation === 'decrypt' && h.status === 'success').length,
    totalFailed: history.filter((h) => h.status === 'failure').length,
  };

  return {
    history,
    addEntry,
    clearHistory,
    removeEntry,
    loadDemoData,
    stats,
    hasHistory: history.length > 0,
  };
}
