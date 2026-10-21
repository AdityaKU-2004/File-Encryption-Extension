/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FILE_EXTENSION } from '../config/encryptionConfig';
import { FileCategory } from '../types/file';

/**
 * Extracts the file extension (lowercase, without leading dot).
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0 || lastDot === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Detects the file category based on extension and optional MIME type.
 */
export function detectFileCategory(filename: string, mimeType?: string): FileCategory {
  const ext = getFileExtension(filename);

  if (ext === 'svault' || mimeType === 'application/x-securevault') {
    return 'encrypted';
  }

  // Videos
  if (
    ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', '3gp'].includes(ext) ||
    mimeType?.startsWith('video/')
  ) {
    return 'video';
  }

  // Images
  if (
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(ext) ||
    mimeType?.startsWith('image/')
  ) {
    return 'image';
  }

  // Audio
  if (
    ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'opus'].includes(ext) ||
    mimeType?.startsWith('audio/')
  ) {
    return 'audio';
  }

  // Spreadsheets
  if (
    ['xls', 'xlsx', 'csv', 'ods', 'tsv'].includes(ext) ||
    mimeType?.includes('spreadsheet') ||
    mimeType?.includes('excel') ||
    mimeType?.includes('csv')
  ) {
    return 'spreadsheet';
  }

  // Presentations
  if (
    ['ppt', 'pptx', 'key', 'odp'].includes(ext) ||
    mimeType?.includes('presentation') ||
    mimeType?.includes('powerpoint')
  ) {
    return 'presentation';
  }

  // Archives
  if (
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso'].includes(ext) ||
    mimeType?.includes('zip') ||
    mimeType?.includes('compressed') ||
    mimeType?.includes('tar')
  ) {
    return 'archive';
  }

  // Documents
  if (
    ['pdf', 'doc', 'docx', 'rtf', 'txt', 'odt', 'md', 'epub'].includes(ext) ||
    mimeType?.startsWith('text/') ||
    mimeType?.includes('pdf') ||
    mimeType?.includes('word')
  ) {
    return 'document';
  }

  // Code files
  if (
    [
      'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp', 'cs', 'html', 'css',
      'json', 'xml', 'yaml', 'yml', 'sh', 'bash', 'rs', 'go', 'php', 'rb', 'sql',
      'swift', 'kt', 'dart', 'vue', 'svelte'
    ].includes(ext)
  ) {
    return 'code';
  }

  return 'other';
}

/**
 * Builds the encrypted filename with the standard .svault extension.
 */
export function getEncryptedFilename(originalFilename: string): string {
  if (originalFilename.toLowerCase().endsWith(FILE_EXTENSION)) {
    return originalFilename;
  }
  return `${originalFilename}${FILE_EXTENSION}`;
}

/**
 * Sanitizes a recovered filename to eliminate path traversal, forbidden characters,
 * and control bytes before saving.
 */
export function sanitizeFilename(name: string, fallback = 'recovered_file'): string {
  if (!name || typeof name !== 'string') {
    return fallback;
  }

  // Remove directory traversal characters and slashes
  let cleaned = name.replace(/[\\/:*?"<>|]/g, '_');
  cleaned = cleaned.replace(/\.\.+/g, '.');

  // Strip non-printable / control ASCII characters
  cleaned = cleaned.replace(/[\x00-\x1f\x80-\x9f]/g, '');

  cleaned = cleaned.trim();

  // Strip leading dots or underscores that might make it hidden or invalid on Windows
  cleaned = cleaned.replace(/^[._]+/, '');

  if (!cleaned || cleaned === '.' || cleaned === '..') {
    return fallback;
  }

  // Ensure length does not exceed standard filesystem filename limit
  if (cleaned.length > 240) {
    const ext = getFileExtension(cleaned);
    const base = cleaned.slice(0, 230);
    return ext ? `${base}.${ext}` : base;
  }

  return cleaned;
}
