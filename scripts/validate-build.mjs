/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  'manifest.json',
  'popup.html',
  'dashboard.html',
  'icons/icon-16.png',
  'icons/icon-32.png',
  'icons/icon-48.png',
  'icons/icon-128.png',
];

function validateTarget(target, isFirefox = false) {
  const distDir = path.join(rootDir, target);
  console.log(`\nValidating ${target}...`);

  if (!fs.existsSync(distDir)) {
    throw new Error(`Target directory does not exist: ${target}`);
  }

  // Ensure no unwanted nested dist/
  if (fs.existsSync(path.join(distDir, 'dist'))) {
    throw new Error(`Found unwanted nested directory: ${target}/dist`);
  }

  // Ensure all required files exist
  for (const relFile of REQUIRED_FILES) {
    const fullPath = path.join(distDir, relFile);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required file in ${target}: ${relFile}`);
    }
  }

  // Validate manifest.json content
  const manifestPath = path.join(distDir, 'manifest.json');
  const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
  let manifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${target}/manifest.json: ${e.message}`);
  }

  if (manifest.manifest_version !== 3) {
    throw new Error(`${target}/manifest.json must have manifest_version: 3`);
  }

  if (!manifest.name || !manifest.version) {
    throw new Error(`${target}/manifest.json missing name or version`);
  }

  if (isFirefox) {
    if (!manifest.browser_specific_settings?.gecko?.id) {
      throw new Error(`Firefox manifest must include browser_specific_settings.gecko.id`);
    }
    console.log(`  ✓ Validated Firefox gecko ID: ${manifest.browser_specific_settings.gecko.id}`);
  } else {
    if (manifest.browser_specific_settings) {
      throw new Error(`Chrome manifest must not include browser_specific_settings`);
    }
  }

  // Check popup.html has valid relative assets
  const popupHtml = fs.readFileSync(path.join(distDir, 'popup.html'), 'utf8');
  if (popupHtml.includes('src="/') || popupHtml.includes('href="/assets')) {
    console.warn(`  ⚠ Warning: ${target}/popup.html has absolute asset paths. Relative paths are preferred.`);
  }

  // Check dashboard.html
  const dashboardHtml = fs.readFileSync(path.join(distDir, 'dashboard.html'), 'utf8');
  if (dashboardHtml.includes('src="/') || dashboardHtml.includes('href="/assets')) {
    console.warn(`  ⚠ Warning: ${target}/dashboard.html has absolute asset paths. Relative paths are preferred.`);
  }

  // Check assets folder
  const assetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetsDir) || fs.readdirSync(assetsDir).length === 0) {
    throw new Error(`${target}/assets directory is missing or empty`);
  }

  console.log(`  ✓ ${target} passed all extension structure and integrity checks!`);
}

try {
  validateTarget('chrome-dist', false);
  validateTarget('firefox-dist', true);
  console.log('\n🎉 Both browser extension distributions verified successfully.');
} catch (err) {
  console.error('\n❌ Validation Error:', err.message);
  process.exit(1);
}
