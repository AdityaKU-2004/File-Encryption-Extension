/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

/**
 * Creates an RGBA PNG buffer without external dependencies.
 */
function createPng(width, height, getPixel) {
  const bytesPerPixel = 4;
  const stride = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(zlib.crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Returns RGBA for coordinate (x, y) rendering a sleek emerald shield icon.
 */
function renderShieldPixel(x, y, width, height) {
  // Normalize coordinates to [-1, 1]
  const nx = (x / (width - 1)) * 2 - 1;
  const ny = (y / (height - 1)) * 2 - 1;

  // Background rounded box / shield container
  const rDist = Math.max(Math.abs(nx), Math.abs(ny));
  const cornerDist = Math.sqrt(
    Math.max(0, Math.abs(nx) - 0.7) ** 2 + Math.max(0, Math.abs(ny) - 0.7) ** 2
  );
  if (rDist > 0.95 || cornerDist > 0.28) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Dark background surface (#0B120E)
  let baseR = 11;
  let baseG = 18;
  let baseB = 14;
  let baseA = 255;

  // Shield geometry: top flat with rounded corners, tapering down to bottom point
  const sx = nx / 0.7; // scaled horizontal [-1, 1]
  const sy = (ny - 0.05) / 0.75; // scaled vertical [-1, 1]

  const inShieldTop = sy >= -0.75 && sy <= 0.1 && Math.abs(sx) <= 0.85;
  const taperWidth = 0.85 * (1 - Math.max(0, (sy - 0.1) / 0.85));
  const inShieldBottom = sy > 0.1 && sy <= 0.95 && Math.abs(sx) <= taperWidth;
  const inShield = inShieldTop || inShieldBottom;

  // Shield border highlight (emerald #22C55E)
  if (inShield) {
    const isBorder =
      Math.abs(sx) > taperWidth - 0.15 ||
      sy < -0.65 ||
      (sy > 0.1 && Math.abs(sx) > taperWidth - 0.2) ||
      sy > 0.85;

    if (isBorder) {
      // Emerald #22C55E border with subtle gradient to #4ADE80
      const blend = (sy + 1) / 2;
      return [
        Math.round(34 + (74 - 34) * blend),
        Math.round(197 + (222 - 197) * blend),
        Math.round(94 + (128 - 94) * blend),
        255,
      ];
    }

    // Shield inner body: deep dark emerald glass
    baseR = 16;
    baseG = 38;
    baseB = 26;

    // Center lock emblem:
    // Lock shackle (top arch)
    const lockArchX = sx / 0.35;
    const lockArchY = (sy + 0.15) / 0.3;
    const archDist = Math.sqrt(lockArchX * lockArchX + lockArchY * lockArchY);
    const inShackle = archDist >= 0.55 && archDist <= 0.95 && lockArchY <= 0.1;

    // Lock body (rectangle)
    const inLockBody =
      Math.abs(sx) <= 0.32 && sy >= -0.05 && sy <= 0.45;

    // Lock keyhole
    const inKeyholeCircle =
      Math.sqrt(sx * sx + (sy - 0.15) * (sy - 0.15)) <= 0.1;
    const inKeyholeStem =
      Math.abs(sx) <= 0.05 && sy >= 0.15 && sy <= 0.32;
    const inKeyhole = inKeyholeCircle || inKeyholeStem;

    if (inShackle || inLockBody) {
      if (inKeyhole) {
        return [11, 18, 14, 255]; // Keyhole cuts through
      }
      // White/emerald lock icon
      return [248, 250, 252, 255];
    }
  }

  // Subtle emerald outer border on rounded icon
  if (rDist > 0.88 || cornerDist > 0.22) {
    return [34, 197, 94, 180];
  }

  return [baseR, baseG, baseB, baseA];
}

const sizes = [16, 32, 48, 128];

for (const size of sizes) {
  const pngBuffer = createPng(size, size, renderShieldPixel);
  const outPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated ${outPath} (${size}x${size}, ${pngBuffer.length} bytes)`);
}

console.log('All extension icons successfully generated.');
