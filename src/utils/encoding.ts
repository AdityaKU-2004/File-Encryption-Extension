/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts a Uint8Array to a Base64 string safely without stack size limits.
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

/**
 * Converts a Base64 string to a Uint8Array safely.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  // Normalize whitespace
  const cleanBase64 = base64.trim().replace(/\s+/g, '');
  const binary = atob(cleanBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts string to Uint8Array UTF-8.
 */
export function stringToUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Converts Uint8Array UTF-8 to string.
 */
export function utf8ToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
