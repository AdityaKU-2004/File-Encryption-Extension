/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting SecureVault cross-browser extension build pipeline...\n');

try {
  // Step 1: Generate crisp PNG icons if not already present
  console.log('📦 Step 1: Ensuring extension icons are generated...');
  execSync('node scripts/generate-icons.mjs', { cwd: rootDir, stdio: 'inherit' });

  // Step 2: Build Chrome extension into chrome-dist/
  console.log('\n🌐 Step 2: Building Chrome extension (chrome-dist/)...');
  execSync('npm run build:chrome', { cwd: rootDir, stdio: 'inherit' });

  // Step 3: Build Firefox extension into firefox-dist/
  console.log('\n🦊 Step 3: Building Firefox extension (firefox-dist/)...');
  execSync('npm run build:firefox', { cwd: rootDir, stdio: 'inherit' });

  // Step 4: Validate both distributions
  console.log('\n🔍 Step 4: Validating extension distributions...');
  execSync('node scripts/validate-build.mjs', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n✅ SecureVault build complete: chrome-dist/ and firefox-dist/ are ready for installation.');
} catch (error) {
  console.error('\n❌ Build pipeline failed:', error?.message || error);
  process.exit(1);
}
