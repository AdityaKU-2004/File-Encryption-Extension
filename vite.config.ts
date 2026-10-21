import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const currentDir = import.meta.dirname ?? path.resolve('.');

function extensionManifestPlugin(targetBrowser: 'chrome' | 'firefox' | null): Plugin {
  return {
    name: 'extension-manifest-plugin',
    closeBundle() {
      if (!targetBrowser) return;

      const outDirName = targetBrowser === 'firefox' ? 'firefox-dist' : 'chrome-dist';
      const outDirPath = path.resolve(currentDir, outDirName);
      const manifestSrc = path.resolve(currentDir, `public/manifests/${targetBrowser}/manifest.json`);
      const manifestDest = path.join(outDirPath, 'manifest.json');

      if (fs.existsSync(manifestSrc)) {
        fs.copyFileSync(manifestSrc, manifestDest);
        console.log(`[vite] Copied ${targetBrowser} manifest.json to ${outDirName}/manifest.json`);
      } else {
        console.warn(`[vite] Warning: Source manifest not found: ${manifestSrc}`);
      }

      // Clean up public/manifests directory if copied over by Vite into outDir
      const copiedManifestsDir = path.join(outDirPath, 'manifests');
      if (fs.existsSync(copiedManifestsDir)) {
        fs.rmSync(copiedManifestsDir, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const targetEnv = process.env.TARGET_BROWSER;
  const isChrome = mode === 'chrome' || targetEnv === 'chrome';
  const isFirefox = mode === 'firefox' || targetEnv === 'firefox';
  const targetBrowser: 'chrome' | 'firefox' | null = isFirefox ? 'firefox' : isChrome ? 'chrome' : null;

  const isExtensionBuild = Boolean(targetBrowser);
  const outDir = isFirefox ? 'firefox-dist' : isChrome ? 'chrome-dist' : 'dist';

  const input: Record<string, string> = isExtensionBuild
    ? {
        popup: path.resolve(currentDir, 'popup.html'),
        dashboard: path.resolve(currentDir, 'dashboard.html'),
      }
    : {
        main: path.resolve(currentDir, 'index.html'),
        popup: path.resolve(currentDir, 'popup.html'),
        dashboard: path.resolve(currentDir, 'dashboard.html'),
      };

  return {
    // Relative base ensures extension pages load local assets correctly
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      extensionManifestPlugin(targetBrowser),
    ],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, '.'),
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

