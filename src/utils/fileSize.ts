/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a byte number into a readable string (e.g., "125 KB", "4.8 MB", "2.3 GB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i === 0) return `${bytes} B`;

  const formatted = (bytes / Math.pow(k, i)).toFixed(i >= 2 ? 1 : 0);
  return `${formatted} ${sizes[i]}`;
}

/**
 * Formats transfer speed in bytes per second.
 */
export function formatSpeed(bytesPerSec: number): string {
  return `${formatFileSize(bytesPerSec)}/s`;
}
