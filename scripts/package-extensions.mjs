/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const buildChrome = args.includes('--chrome') || !args.includes('--firefox');
const buildFirefox = args.includes('--firefox') || !args.includes('--chrome');

function packageFolder(sourceDir, targetArchiveName) {
  const absSource = path.resolve(rootDir, sourceDir);
  const absTarget = path.resolve(rootDir, targetArchiveName);

  if (!fs.existsSync(absSource)) {
    console.error(`❌ Source directory ${sourceDir} does not exist. Run 'npm run build' first.`);
    process.exit(1);
  }

  // Remove existing archive if present
  if (fs.existsSync(absTarget)) {
    fs.unlinkSync(absTarget);
  }

  console.log(`📦 Packaging ${sourceDir}/ into ${targetArchiveName}...`);

  // Python zipfile script that packs files recursively from source directory
  const pyScript = `
import zipfile, os, sys

source_dir = sys.argv[1]
target_file = sys.argv[2]

with zipfile.ZipFile(target_file, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, source_dir)
            zf.write(full_path, rel_path)
`;

  try {
    execSync(`python3 -c "${pyScript.replace(/"/g, '\\"')}" "${absSource}" "${absTarget}"`, {
      stdio: 'inherit'
    });

    const stats = fs.statSync(absTarget);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ Successfully generated ${targetArchiveName} (${sizeKB} KB)`);
  } catch (err) {
    console.error(`❌ Failed to create ${targetArchiveName}:`, err?.message || err);
    process.exit(1);
  }
}

console.log('🚀 SecureVault Extension Packager\n');

// Ensure dist folders are fresh
if (buildFirefox) {
  if (!fs.existsSync(path.resolve(rootDir, 'firefox-dist/manifest.json'))) {
    console.log('⚡ firefox-dist not found, running build:firefox...');
    execSync('npm run build:firefox', { cwd: rootDir, stdio: 'inherit' });
  }
  packageFolder('firefox-dist', 'securevault-firefox.xpi');
}

if (buildChrome) {
  if (!fs.existsSync(path.resolve(rootDir, 'chrome-dist/manifest.json'))) {
    console.log('⚡ chrome-dist not found, running build:chrome...');
    execSync('npm run build:chrome', { cwd: rootDir, stdio: 'inherit' });
  }
  packageFolder('chrome-dist', 'securevault-chrome.zip');
}

console.log('\n🎉 Packaging complete! You can now load or distribute the extension packages.');
