/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { HistoryEntry } from '../types/history';

export function useHistory() {
  // Empty state by default as required by specification
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 in memory
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadDemoData = useCallback(() => {
    const now = Date.now();
    const demoEntries: HistoryEntry[] = [
      {
        id: 'demo-1',
        operation: 'encrypt',
        status: 'success',
        timestamp: now - 1000 * 60 * 12,
        characterCount: 384,
        executionTimeMs: 42,
        algorithm: 'AES-256-GCM',
      },
      {
        id: 'demo-2',
        operation: 'decrypt',
        status: 'success',
        timestamp: now - 1000 * 60 * 35,
        characterCount: 384,
        executionTimeMs: 38,
        algorithm: 'AES-256-GCM',
      },
      {
        id: 'demo-3',
        operation: 'decrypt',
        status: 'failure',
        timestamp: now - 1000 * 60 * 95,
        characterCount: 120,
        executionTimeMs: 24,
        algorithm: 'AES-256-GCM',
        errorMessage: 'Authentication failed: Incorrect password or message was modified.',
      },
    ];
    setHistory(demoEntries);
  }, []);

  return {
    history,
    addEntry,
    clearHistory,
    removeEntry,
    loadDemoData,
    hasHistory: history.length > 0,
  };
}
