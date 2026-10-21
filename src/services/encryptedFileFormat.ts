/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FORMAT_VERSION } from '../config/encryptionConfig';
import { ParsedContainerHeader } from '../types/file';

const MAGIC_BYTES = new Uint8Array([0x53, 0x56, 0x41, 0x55, 0x4c, 0x54]); // 'SVAULT' in ASCII
export const HEADER_SIZE = 55;

/**
 * Rapidly validates whether a File begins with the SecureVault container header
 * by reading only the first 55 bytes via file.slice, avoiding loading large files into RAM.
 */
export async function quickValidateContainerHeader(
  file: File
): Promise<{ isValid: boolean; version?: number; iterations?: number; error?: string }> {
  if (file.size < HEADER_SIZE) {
    return {
      isValid: false,
      error: 'File is smaller than the minimum SecureVault container header.',
    };
  }

  try {
    const headerSlice = file.slice(0, HEADER_SIZE);
    const buffer = await headerSlice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. Check magic bytes 'SVAULT'
    for (let i = 0; i < MAGIC_BYTES.length; i++) {
      if (bytes[i] !== MAGIC_BYTES[i]) {
        return {
          isValid: false,
          error: 'Missing SecureVault magic identifier. File is not a valid SecureVault container.',
        };
      }
    }

    // 2. Check format version
    const version = bytes[6];
    if (version !== FORMAT_VERSION) {
      return {
        isValid: false,
        version,
        error: `Unsupported container version ${version}. Only version 1 is supported.`,
      };
    }

    // 3. Read iteration count
    const dataView = new DataView(buffer);
    const iterations = dataView.getUint32(7, false); // Big endian

    return { isValid: true, version, iterations };
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Unable to inspect container header.',
    };
  }
}

/**
 * Parses the complete binary header from an ArrayBuffer slice.
 */
export function parseContainerHeader(buffer: ArrayBuffer): {
  isValid: boolean;
  version: number;
  iterations: number;
  salt: Uint8Array;
  metadataIv: Uint8Array;
  payloadIv: Uint8Array;
  metadataLength: number;
  metadataOffset: number;
  payloadOffset: number;
  error?: string;
} {
  if (buffer.byteLength < HEADER_SIZE) {
    return {
      isValid: false,
      version: 0,
      iterations: 0,
      salt: new Uint8Array(0),
      metadataIv: new Uint8Array(0),
      payloadIv: new Uint8Array(0),
      metadataLength: 0,
      metadataOffset: 0,
      payloadOffset: 0,
      error: 'Header buffer too short.',
    };
  }

  const bytes = new Uint8Array(buffer);

  // Check magic bytes
  for (let i = 0; i < MAGIC_BYTES.length; i++) {
    if (bytes[i] !== MAGIC_BYTES[i]) {
      return {
        isValid: false,
        version: 0,
        iterations: 0,
        salt: new Uint8Array(0),
        metadataIv: new Uint8Array(0),
        payloadIv: new Uint8Array(0),
        metadataLength: 0,
        metadataOffset: 0,
        payloadOffset: 0,
        error: 'Invalid magic signature.',
      };
    }
  }

  const version = bytes[6];
  const dataView = new DataView(buffer);
  const iterations = dataView.getUint32(7, false);
  const salt = bytes.slice(11, 27);         // 16 bytes salt
  const metadataIv = bytes.slice(27, 39);   // 12 bytes metadata IV
  const payloadIv = bytes.slice(39, 51);    // 12 bytes payload IV
  const metadataLength = dataView.getUint32(51, false); // 4 bytes metadata length

  const metadataOffset = HEADER_SIZE;
  const payloadOffset = metadataOffset + metadataLength;

  return {
    isValid: true,
    version,
    iterations,
    salt,
    metadataIv,
    payloadIv,
    metadataLength,
    metadataOffset,
    payloadOffset,
  };
}

/**
 * Builds the binary header for a new .svault container.
 */
export function buildContainerHeader(
  version: number,
  iterations: number,
  salt: Uint8Array,
  metadataIv: Uint8Array,
  payloadIv: Uint8Array,
  encryptedMetadataLength: number
): Uint8Array {
  const header = new Uint8Array(HEADER_SIZE);

  // Magic 'SVAULT' (6 bytes)
  header.set(MAGIC_BYTES, 0);

  // Version (1 byte)
  header[6] = version;

  const dataView = new DataView(header.buffer);

  // Iterations (4 bytes, Big-endian)
  dataView.setUint32(7, iterations, false);

  // Salt (16 bytes)
  header.set(salt, 11);

  // Metadata IV (12 bytes)
  header.set(metadataIv, 27);

  // Payload IV (12 bytes)
  header.set(payloadIv, 39);

  // Encrypted Metadata Length (4 bytes, Big-endian)
  dataView.setUint32(51, encryptedMetadataLength, false);

  return header;
}
