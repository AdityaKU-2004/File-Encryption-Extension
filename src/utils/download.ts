/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Downloads text as a local file using Blob and object URLs, safely revoking the URL afterwards.
 */
export function downloadTextFile(text: string, filename: string): { success: boolean; error?: string } {
  if (!text) {
    return { success: false, error: 'Cannot download empty content.' };
  }

  try {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after a short timeout to ensure browser has queued the download
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to trigger file download.',
    };
  }
}
