/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Downloads a binary Blob as a local file, revoking the object URL safely.
 */
export function downloadBlob(blob: Blob, filename: string): { success: boolean; error?: string } {
  if (!blob) {
    return { success: false, error: 'Cannot download empty data.' };
  }

  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after a short timeout so the browser has queued the stream
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2500);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to trigger file download.',
    };
  }
}

/**
 * Downloads a text string as a UTF-8 text file.
 */
export function downloadTextFile(text: string, filename: string): { success: boolean; error?: string } {
  if (!text) {
    return { success: false, error: 'Cannot download empty content.' };
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  return downloadBlob(blob, filename);
}
