/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Safely copies text to the clipboard with fallback for non-secure contexts.
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; error?: string }> {
  if (!text) {
    return { success: false, error: 'Nothing to copy.' };
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }

    // Fallback using textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true };
    }
    return { success: false, error: 'Browser refused copy operation.' };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Clipboard access denied or not supported.',
    };
  }
}

/**
 * Safely reads text from the clipboard.
 */
export async function readFromClipboard(): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      return { success: true, text };
    }
    return {
      success: false,
      error: 'Clipboard reading is not supported by your browser in this context. Please paste manually.',
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Clipboard permission was denied.',
    };
  }
}
