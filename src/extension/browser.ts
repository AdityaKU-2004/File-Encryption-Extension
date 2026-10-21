/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Cross-browser extension API abstraction layer.
 * Safely wraps Chrome (MV3) and Firefox WebExtensions APIs with fallbacks for
 * the standard web development environment and preview iframe.
 */

// Global type declarations for extension runtimes
declare const chrome: any;
declare const browser: any;

/**
 * Checks whether the current context is running inside a browser extension
 * (e.g., popup window, options page, or extension tab).
 */
export function isExtensionEnvironment(): boolean {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.id) {
      return true;
    }
    if (typeof browser !== 'undefined' && browser?.runtime?.id) {
      return true;
    }
  } catch {
    // Context isolated or restricted
  }
  return false;
}

/**
 * Resolves a packaged extension asset path or falls back to relative path.
 */
export function getExtensionUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;

  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) {
      return chrome.runtime.getURL(normalized);
    }
  } catch {
    // ignore
  }

  try {
    if (typeof browser !== 'undefined' && browser?.runtime?.getURL) {
      return browser.runtime.getURL(normalized);
    }
  } catch {
    // ignore
  }

  return `./${normalized}`;
}

/**
 * Opens the full dashboard page in a new browser tab.
 * Uses chrome.tabs.create, browser.tabs.create, or window.open depending on environment.
 */
export async function openDashboardTab(): Promise<void> {
  const targetUrl = getExtensionUrl('dashboard.html');

  // Try Chrome tabs API
  try {
    if (typeof chrome !== 'undefined' && chrome?.tabs?.create) {
      chrome.tabs.create({ url: targetUrl });
      return;
    }
  } catch (err) {
    console.debug('Chrome tabs API unavailable, using fallback', err);
  }

  // Try Firefox WebExtensions tabs API
  try {
    if (typeof browser !== 'undefined' && browser?.tabs?.create) {
      await browser.tabs.create({ url: targetUrl });
      return;
    }
  } catch (err) {
    console.debug('Firefox browser tabs API unavailable, using fallback', err);
  }

  // Try window.open fallback
  try {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Failed to open dashboard tab:', err);
  }
}

/**
 * Returns extension version string from manifest or default '1.0.0'.
 */
export function getExtensionVersion(): string {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.getManifest) {
      const m = chrome.runtime.getManifest();
      if (m?.version) return m.version;
    }
    if (typeof browser !== 'undefined' && browser?.runtime?.getManifest) {
      const m = browser.runtime.getManifest();
      if (m?.version) return m.version;
    }
  } catch {
    // ignore
  }
  return '1.0.0';
}
