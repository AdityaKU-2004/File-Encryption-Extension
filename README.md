# SecureVault — Cross-Browser File Encryption Extension

<div align="center">

```
  ____                             __     __             _  _   
 / ___|   ___   ___  _   _  _ __  \ \   / /  __ _  _   _| || |_ 
 \___ \  / _ \ / __|| | | || '__|  \ \ / /  / _` || | | || || __|
  ___) ||  __/| (__ | |_| || |      \ V /  | (_| || |_| || || |_ 
 |____/  \___| \___| \__,_||_|       \_/    \__,_| \__,_||_| \__|
```

> **"Your files. Your privacy. Your control."**  
> *Military-grade, zero-knowledge file encryption directly inside your browser.*

---

<!-- Badges / Stickers -->
[![Version](https://img.shields.io/badge/version-1.0.0-10b981.svg?style=for-the-badge&logo=semver&logoColor=white)](package.json)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-10b981.svg?style=for-the-badge&logo=googlechrome&logoColor=white)](public/manifests/chrome/manifest.json)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)
[![Zero Knowledge](https://img.shields.io/badge/Security-Zero--Knowledge-darkgreen.svg?style=for-the-badge&logo=shield&logoColor=white)](#-cryptographic--security-architecture)

<!-- Browser Compatibility Badges -->
[![Google Chrome](https://img.shields.io/badge/Google%20Chrome-Compatible-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](#-testing-in-google-chrome--chromium-browsers)
[![Mozilla Firefox](https://img.shields.io/badge/Mozilla%20Firefox-Compatible-FF7139?style=flat-square&logo=firefoxbrowser&logoColor=white)](#-testing-in-mozilla-firefox)
[![Microsoft Edge](https://img.shields.io/badge/Microsoft%20Edge-Compatible-0078D7?style=flat-square&logo=microsoftedge&logoColor=white)](#-testing-in-google-chrome--chromium-browsers)
[![Brave Browser](https://img.shields.io/badge/Brave-Compatible-FB542B?style=flat-square&logo=brave&logoColor=white)](#-testing-in-google-chrome--chromium-browsers)
[![Chromium](https://img.shields.io/badge/Chromium-Supported-005BBB?style=flat-square&logo=chromium&logoColor=white)](#-testing-in-google-chrome--chromium-browsers)

<!-- Technology Stack Badges -->
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Web Cryptography API](https://img.shields.io/badge/Web%20Crypto-AES--256--GCM-success.svg?style=flat-square&logo=w3c&logoColor=white)](#-cryptographic--security-architecture)

</div>

---

## 📑 Table of Contents

- [✨ Overview & Highlights](#-overview--highlights)
- [📁 Supported File Categories](#-supported-file-categories)
- [🏗️ Extension Architecture & Dual UI](#-extension-architecture--dual-ui)
- [📦 Directory Structure](#-directory-structure)
- [⚙️ Building the Project](#️-building-the-project)
  - [Prerequisites](#prerequisites)
  - [NPM Build Scripts](#npm-build-scripts)
  - [Full Multi-Browser Build](#full-multi-browser-build)
  - [Independent Target Builds](#independent-target-builds)
- [🦊 Packaging `.xpi` Files for Firefox](#-packaging-xpi-files-for-firefox)
  - [What is an `.xpi` File?](#what-is-an-xpi-file)
  - [Method 1: Automated NPM Script (Recommended)](#method-1-automated-npm-script-recommended)
  - [Method 2: Command Line (Linux & macOS `zip`)](#method-2-command-line-linux--macos-zip)
  - [Method 3: Windows PowerShell](#method-3-windows-powershell)
  - [Method 4: Mozilla Official `web-ext` CLI](#method-4-mozilla-official-web-ext-cli)
  - [Method 5: Python One-Liner](#method-5-python-one-liner)
  - [Signing & Distribution for Firefox AMO](#signing--distribution-for-firefox-amo)
- [🌐 Testing in Google Chrome & Chromium Browsers](#-testing-in-google-chrome--chromium-browsers)
- [🦊 Testing in Mozilla Firefox](#-testing-in-mozilla-firefox)
- [🧪 End-to-End Test Plan & Verification](#-end-to-end-test-plan--verification)
- [🛡️ Cryptographic & Security Architecture](#-cryptographic--security-architecture)
- [🔒 Permissions & Privacy Principles](#-permissions--privacy-principles)
- [📄 License](#-license)

---

## ✨ Overview & Highlights

**SecureVault** is a privacy-first browser extension and web application that enables local, authenticated file encryption and decryption without relying on third-party servers, cloud services, or external binaries.

- 🛡️ **Zero Remote Leakage**: All cryptographic operations execute 100% in local memory using the browser's hardware-accelerated **Web Cryptography API**.
- 🔐 **Military-Grade Security**: Uses **AES-256-GCM** (Galois/Counter Mode) with **PBKDF2-SHA-256** key derivation and unique cryptographic salts and IVs per file.
- 🧩 **Cross-Browser Compatibility**: Out-of-the-box build targets for both **Manifest V3 Chrome/Chromium** and **Manifest V3 Firefox** (with `gecko.id` integration).
- 🎛️ **Dual-Interface Flexibility**:
  - **Extension Popup** (`popup.html`): Ultra-compact 390px action UI for instant single-file operations.
  - **Full-Page Dashboard** (`dashboard.html`): Immersive cybersecurity workstation for batch queueing, cryptographic parameter inspection, and session audits.
- 🎨 **Adaptive Cyber Aesthetic**: High-contrast dark neon mode (`#0a0f0d` with `#10b981` emerald accents) and clean light mode with glassmorphic cards.
- 📦 **Standalone Binary Container (`.svault`)**: Custom authenticated file packaging preserving original filename, size, and MIME type metadata with tamper detection.

---

## 📁 Supported File Categories

SecureVault operates on raw binary streams (`ArrayBuffer`), guaranteeing universal support for every file type without corruption:

| Category | Typical Formats | Encryption & Decryption Support |
|---|---|:---:|
| 🎥 **Video & Media** | `.mp4`, `.mkv`, `.mov`, `.avi`, `.webm` | ✅ Full Support |
| 📄 **Documents** | `.pdf`, `.docx`, `.doc`, `.odt`, `.rtf`, `.txt`, `.md` | ✅ Full Support |
| 📊 **Presentations & Sheets** | `.pptx`, `.ppt`, `.xlsx`, `.xls`, `.csv` | ✅ Full Support |
| 🖼️ **Images** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.psd`, `.raw` | ✅ Full Support |
| 🎵 **Audio** | `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.m4a` | ✅ Full Support |
| 🗜️ **Archives & Packages** | `.zip`, `.tar`, `.gz`, `.7z`, `.rar`, `.iso`, `.dmg` | ✅ Full Support |
| 💻 **Code & Databases** | `.ts`, `.js`, `.py`, `.json`, `.sql`, `.sqlite`, `.db` | ✅ Full Support |
| ⚙️ **Binary & Custom** | Executables, firmware dumps, arbitrary binary streams | ✅ Full Support |

---

## 🏗️ Extension Architecture & Dual UI

```
┌─────────────────────────────────────────────────────────────────┐
│                    SecureVault Browser Runtime                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│    Action Popup (390px wide)    │   │      Full-Page Dashboard        │
│       `chrome-dist/popup.html`  │   │   `chrome-dist/dashboard.html`  │
│      `firefox-dist/popup.html`  │   │  `firefox-dist/dashboard.html`  │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ • Quick File Dropzone           │   │ • Batch Multi-File Queue        │
│ • Password Generator (12-64 ch) │   │ • Detailed File Inspector       │
│ • Strength Meter (Entropy bits) │   │ • Cryptographic Audit Log       │
│ • "Open Dashboard" button       │   │ • In-depth Hash Analysis        │
└────────────────┬────────────────┘   └────────────────┬────────────────┘
                 │                                     │
                 └───────────────────┬─────────────────┘
                                     ▼
                ┌─────────────────────────────────────────┐
                │   Cross-Browser Abstraction Layer       │
                │         `src/extension/browser.ts`      │
                │  Handles `chrome.*` & `browser.*` APIS  │
                └────────────────────┬────────────────────┘
                                     ▼
                ┌─────────────────────────────────────────┐
                │        Client-Side Crypto Core          │
                │    AES-256-GCM + PBKDF2 (SHA-256)       │
                │   Web Cryptography API (SubtleCrypto)   │
                └─────────────────────────────────────────┘
```

---

## 📦 Directory Structure

```
securevault/
├── chrome-dist/                  # Chrome / Chromium Unpacked Extension
│   ├── manifest.json             # Manifest V3 for Chromium browsers
│   ├── popup.html                # 390px action popup entry point
│   ├── dashboard.html            # Full-page workstation tab entry point
│   ├── icons/                    # 16x16, 32x32, 48x48, 128x128 icons
│   └── assets/                   # Compiled JS chunks & Tailwind CSS
│
├── firefox-dist/                 # Firefox WebExtension
│   ├── manifest.json             # Manifest V3 with Gecko extension ID
│   ├── popup.html                # 390px action popup entry point
│   ├── dashboard.html            # Full-page workstation tab entry point
│   ├── icons/                    # Extension icons
│   └── assets/                   # Compiled JS chunks & Tailwind CSS
│
├── public/
│   ├── icons/                    # Source PNG & SVG icons
│   └── manifests/
│       ├── chrome/manifest.json  # Chromium Manifest source
│       └── firefox/manifest.json # Firefox Manifest source
│
├── scripts/
│   ├── build-all.mjs             # Orchestrated multi-browser build pipeline
│   ├── generate-icons.mjs        # Programmatic high-res icon generator
│   ├── package-extensions.mjs    # Generates .xpi and .zip distribution archives
│   └── validate-build.mjs        # Validates manifest & asset bundle integrity
│
├── src/
│   ├── components/               # UI components (Dropzone, Stats, PasswordInput, etc.)
│   ├── extension/
│   │   ├── browser.ts            # Unified Chrome/Firefox runtime API bridge
│   │   ├── popup.tsx             # Popup React entry point
│   │   └── dashboard.tsx         # Dashboard React entry point
│   ├── services/                 # WebCrypto AES-GCM engine & container parser
│   └── types/                    # TypeScript interfaces
│
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # Strict TypeScript configuration
└── vite.config.ts                # Dual-mode multi-page Vite bundle configuration
```

---

## ⚙️ Building the Project

### Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v20 & v22 LTS)
- **NPM**: `v9.0.0` or higher (or Bun / PNPM)
- **Python 3** *(optional, for fast packaging)*: Standard on Linux/macOS

First, ensure dependencies are installed:

```bash
npm install
```

### NPM Build Scripts

| Command | Action | Output Artifacts |
|---|---|---|
| `npm run build` | **Main Build**: Compiles Chrome & Firefox builds + validation | `chrome-dist/` and `firefox-dist/` |
| `npm run build:chrome` | Compiles Chromium Manifest V3 extension only | `chrome-dist/` |
| `npm run build:firefox` | Compiles Firefox Manifest V3 extension only | `firefox-dist/` |
| `npm run package` | Builds and compresses both extensions into archives | `securevault-chrome.zip` & `securevault-firefox.xpi` |
| `npm run package:xpi` | Generates the Firefox `.xpi` add-on archive | `securevault-firefox.xpi` |
| `npm run package:zip` | Generates the Chrome distribution `.zip` archive | `securevault-chrome.zip` |
| `npm run dev` | Runs the local Vite development server with HMR | `http://localhost:3000` |
| `npm run typecheck` | Validates strict TypeScript types with zero emissions | Console report |
| `npm run clean` | Removes all previous build artifacts and archives | Cleans `dist`, `*-dist`, `*.xpi`, `*.zip` |

---

### Full Multi-Browser Build

To build both browser distributions in a single command:

```bash
npm run build
```

This automated pipeline executes:
1. `scripts/generate-icons.mjs`: Ensures high-resolution 16px, 32px, 48px, and 128px PNG icons exist.
2. `npm run build:chrome`: Invokes Vite in Chrome mode to produce `chrome-dist/`.
3. `npm run build:firefox`: Invokes Vite in Firefox mode to produce `firefox-dist/`.
4. `scripts/validate-build.mjs`: Inspects both directories for manifest syntax, required icons, valid entry points, and Gecko ID verification.

### Independent Target Builds

If you are only working on one browser, build each independently:

```bash
# Chrome / Edge / Brave / Chromium only:
npm run build:chrome

# Mozilla Firefox only:
npm run build:firefox
```

---

## 🦊 Packaging `.xpi` Files for Firefox

### What is an `.xpi` File?

An **`.xpi`** (pronounced *"zippy"*, short for *Cross-Platform Installer*) is the standard file packaging format used by Mozilla Firefox for extensions and themes. 

Technically, an `.xpi` file is simply a standard **PKZIP (ZIP) archive** whose root directory directly contains:
- `manifest.json` (at the root of the archive, **not** nested inside a folder)
- `popup.html` & `dashboard.html`
- `icons/`
- `assets/`

> ⚠️ **CRITICAL RULE**: The contents of `firefox-dist/` must be placed directly at the root of the `.xpi` archive. If you zip the folder `firefox-dist` itself, Firefox will reject it with the error: `"This add-on could not be installed because it appears to be corrupt."`

---

### Method 1: Automated NPM Script (Recommended)

SecureVault includes a built-in packaging script that formats the `.xpi` file automatically:

```bash
# Generate the Firefox .xpi package:
npm run package:xpi
```

To package both Firefox `.xpi` and Chrome `.zip` simultaneously:

```bash
npm run package
```

**Output**:
- `securevault-firefox.xpi` (ready for Firefox installation or AMO submission)
- `securevault-chrome.zip` (ready for Chrome Web Store upload)

---

### Method 2: Command Line (Linux & macOS `zip`)

If you prefer building the `.xpi` directly from your terminal using native Unix `zip`:

1. Ensure the Firefox distribution is built:
   ```bash
   npm run build:firefox
   ```

2. Change directory into `firefox-dist` and zip the contents:
   ```bash
   cd firefox-dist
   zip -r ../securevault-firefox.xpi *
   cd ..
   ```

3. Confirm the archive contents:
   ```bash
   unzip -l securevault-firefox.xpi
   ```
   *Verify that `manifest.json` is listed at the root (`manifest.json`), not `firefox-dist/manifest.json`.*

---

### Method 3: Windows PowerShell

On Windows PowerShell:

1. Build the distribution:
   ```powershell
   npm run build:firefox
   ```

2. Archive the contents of `firefox-dist`:
   ```powershell
   Compress-Archive -Path firefox-dist\* -DestinationPath securevault-firefox.zip
   Rename-Item -Path securevault-firefox.zip -NewName securevault-firefox.xpi
   ```

---

### Method 4: Mozilla Official `web-ext` CLI

You can also use Mozilla's official developer tool [`web-ext`](https://github.com/mozilla/web-ext):

```bash
# Build using npx (no global install required):
npx web-ext build --source-dir=firefox-dist --artifacts-dir=web-ext-artifacts --overwrite-dest
```

This will output an `.xpi` or `.zip` file inside `web-ext-artifacts/`.

---

### Method 5: Python One-Liner

Using Python 3 (available on nearly all systems):

```bash
npm run build:firefox
python3 -c "import zipfile, os; z = zipfile.ZipFile('securevault-firefox.xpi', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'firefox-dist')) for r, d, fs in os.walk('firefox-dist') for f in fs]; z.close()"
```

---

### Signing & Distribution for Firefox AMO

For permanent, production use in regular Mozilla Firefox release builds:

1. Create a developer account at [Mozilla Add-on Developer Hub (AMO)](https://addons.mozilla.org/developers/).
2. Submit your `securevault-firefox.xpi` for:
   - **Self-distribution (Unlisted)**: Mozilla signs your `.xpi` within minutes. You can host the signed `.xpi` on GitHub Releases, your intranet, or distribute directly to users.
   - **Public Listing (Listed)**: SecureVault will appear on the Firefox Add-ons marketplace.
3. For local automated signing using your AMO API credentials:
   ```bash
   npx web-ext sign --source-dir=firefox-dist --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
   ```

---

## 🌐 Testing in Google Chrome & Chromium Browsers

Compatible with **Google Chrome**, **Microsoft Edge**, **Brave Browser**, **Opera**, and **Vivaldi**.

### Step 1: Build the Chrome Extension

```bash
npm run build:chrome
```
*(Or `npm run build`)*

### Step 2: Open Extensions Management

In Google Chrome, navigate to:
```
chrome://extensions
```
*(In Brave: `brave://extensions` | In Edge: `edge://extensions`)*

### Step 3: Enable Developer Mode

Locate the toggle switch labeled **"Developer mode"** in the top-right corner of the page and turn it **ON**.

### Step 4: Load Unpacked Extension

1. Click the **"Load unpacked"** button in the top-left toolbar.
2. In the file picker dialog, browse to your project folder and select:
   ```
   /path/to/securevault/chrome-dist
   ```
3. Click **Select Folder** / **Open**.

### Step 5: Pin the Extension & Test the Popup

1. Click the puzzle-piece icon (Extensions) in your browser toolbar.
2. Find **SecureVault** and click the **Pin** icon.
3. Click the SecureVault green shield icon to open the **Popup Window**:
   - **Direct Drag & Drop**: Drag and drop any file directly onto the drop zone.
   - **Persistent Detached Window**: In Chrome and Chromium browsers, opening an OS file picker from a toolbar dropdown popup may cause the browser to automatically dismiss the popup upon losing window focus. SecureVault provides an **"Open in detached window"** button (`ExternalLink` icon in the popup header and inside the drop zone). Clicking this opens a dedicated, persistent window that never closes when selecting files from your computer.
   - Enter a secure password (use the password generator to test generation).
   - Click **"Encrypt File"**.
   - Download the resulting `.svault` file.
   - Switch to the **"Decrypt"** tab and restore the original file.

### Step 6: Test the Full-Page Dashboard

1. In the popup, click the **"Open SecureVault"** (expand) button at the top right or click the Dashboard link in the footer.
2. A new browser tab will open displaying `chrome-extension://<extension-id>/dashboard.html`.
3. Test batch encryption, audit logs, and settings in full-screen view.

### Step 7: How to Debug / Inspect Console in Chrome

- **Debugging Popup**: Right-click anywhere inside the SecureVault popup window and choose **"Inspect"**. This opens Chrome DevTools scoped to `popup.html` (note that keeping DevTools open also pins the popup and prevents it from auto-closing).
- **Debugging Dashboard**: Press `F12` or `Ctrl+Shift+I` (Mac: `Cmd+Option+I`) while on `dashboard.html`.
- **Reloading Code Changes**: When you recompile (`npm run build:chrome`), return to `chrome://extensions` and click the **Refresh (↻)** icon on the SecureVault card.

---

## 🦊 Testing in Mozilla Firefox

Compatible with **Firefox Standard**, **Firefox Developer Edition**, and **Firefox Nightly**.

### Step 1: Build the Firefox Extension

```bash
npm run build:firefox
```

*(Or build the `.xpi` via `npm run package:xpi`)*

### Step 2: Open Firefox Debugging

In Mozilla Firefox, enter the following URL in the address bar:
```
about:debugging#/runtime/this-firefox
```

### Step 3: Load Temporary Add-on

1. In the **"This Firefox"** section, locate the heading **"Temporary Extensions"**.
2. Click the **"Load Temporary Add-on..."** button.
3. You have two options:
   - **Option A (Unpacked Folder)**: Navigate into `firefox-dist/` and select **`manifest.json`**.
   - **Option B (Packaged XPI)**: Select **`securevault-firefox.xpi`** from your project root.
4. SecureVault will immediately appear in the extension list with Extension ID:
   ```
   securevault@local-extension
   ```

### Step 4: Pin and Test

1. Click the extension puzzle piece icon in the Firefox toolbar.
2. Pin SecureVault to the toolbar.
3. Click the icon to verify the 390px popup layout, file encryption, and theme toggling.
4. Click **"Open SecureVault"** to verify the full tab `dashboard.html`.

### Step 5: How to Debug / Inspect Console in Firefox

1. In `about:debugging#/runtime/this-firefox`, find the **SecureVault** card.
2. Click the **"Inspect"** button on the extension card.
3. A dedicated Firefox Developer Tools Toolbox will open, allowing you to view console logs, inspect HTML/CSS elements, and debug WebCrypto API execution.
4. To reload after code edits: Click **"Reload"** on the SecureVault card in `about:debugging`.

### Step 6: Permanent Testing in Firefox Nightly / Developer Edition

Standard Firefox requires AMO signatures for permanently installed extensions. For persistent local testing without reloading after browser restart:
1. Open **Firefox Developer Edition** or **Firefox Nightly**.
2. Go to `about:config` and set:
   ```
   xpinstall.signatures.required = false
   ```
3. Open `about:addons`, click the gear icon (⚙️) -> **"Install Add-on From File..."** and select `securevault-firefox.xpi`.

---

## 🧪 End-to-End Test Plan & Verification

Run through these comprehensive verification test cases to ensure 100% cryptographic and functional integrity:

### Test 1: Encryption & Decryption Roundtrip
1. Prepare a test document (e.g., `contract.pdf` or `photo.jpg`).
2. Encrypt the file using password: `CorrectHorseBatteryStaple!2026`.
3. Save the resulting file (`contract.pdf.svault`).
4. Switch to **Decrypt** tab, upload `contract.pdf.svault`, enter the identical password.
5. Click **Decrypt File** and open the restored file.
6. **Expected Result**: File opens cleanly and has identical SHA-256 checksum to original.

### Test 2: Tamper Detection (Authentication Tag Verification)
1. Encrypt any test file to create `test.svault`.
2. Open `test.svault` in a hex editor or run:
   ```bash
   # Flip a single byte inside ciphertext:
   python3 -c "data = bytearray(open('test.svault','rb').read()); data[-10] ^= 0xFF; open('tampered.svault','wb').write(data)"
   ```
3. Attempt to decrypt `tampered.svault` in SecureVault with the correct password.
4. **Expected Result**: Decryption fails with an explicit error: `"Authentication tag mismatch or invalid password"`. The file is rejected before any corrupted plaintext is emitted.

### Test 3: Wrong Password Rejection
1. Attempt to decrypt an encrypted `.svault` file using an incorrect password.
2. **Expected Result**: Decryption aborts safely without crashing, presenting a clear error notification.

### Test 4: Cross-Browser Compatibility Test
1. Encrypt a file inside **Google Chrome** (`chrome-dist`).
2. Load the resulting `.svault` file inside **Mozilla Firefox** (`firefox-dist`).
3. Decrypt the file with the original password.
4. **Expected Result**: Seamless decryption across browser boundaries.

### Test 5: Theme Switching & State
1. Toggle between Dark Neon Mode and Clean Light Mode using the sun/moon button in both Popup and Dashboard.
2. Close and reopen the popup.
3. **Expected Result**: Selected theme preference persists in local storage.

---

## 🛡️ Cryptographic & Security Architecture

```
                  RAW FILE BYTES (Cleartext)
                             │
                             ▼
┌────────────────────────────────────────────────────────┐
│  Key Derivation Function: PBKDF2 (NIST SP 800-132)      │
│  • Master Password (user input)                        │
│  • Salt: 16 bytes (128-bit) CSPRNG                     │
│  • Hash Algorithm: SHA-256                             │
│  • Iterations: 100,000 rounds                          │
└────────────────────────────┬───────────────────────────┘
                             │ Derived 256-bit Key
                             ▼
┌────────────────────────────────────────────────────────┐
│  Authenticated Cipher: AES-GCM (NIST SP 800-38D)       │
│  • Key Size: 256 bits                                  │
│  • Initialization Vector (IV): 12 bytes (96-bit) CSPRNG│
│  • Authentication Tag: 16 bytes (128 bits)             │
│  • Associated Data (AAD): File metadata header         │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
                   ENCRYPTED .svault CONTAINER
```

### The `.svault` Binary Container Format

When a file is encrypted, SecureVault wraps the ciphertext into a tamper-evident binary format:

```
+----------------+----------------+----------------+----------------+
|  Magic Bytes   | Version (1B)   | Salt (16B)     | IV (12B)       |
| "SVAULT" (6B)  | 0x01           | PBKDF2 Salt    | AES-GCM IV     |
+----------------+----------------+----------------+----------------+
| Metadata Length| Metadata JSON (Original Name, MIME, Size, Timestamp)|
| (2 Bytes uint16)|                                                 |
+----------------+--------------------------------------------------+
| Ciphertext Payload + 128-bit Authentication Tag (End of Stream)   |
+-------------------------------------------------------------------+
```

---

## 🔒 Permissions & Privacy Principles

SecureVault strictly adheres to the **Principle of Least Privilege**:

- ❌ **No `<all_urls>` or `*://*/*`**: SecureVault does not inject scripts or read webpage content.
- ❌ **No History or Cookies**: Zero access to browser history, bookmarks, or browsing activities.
- ❌ **No Remote Telemetry**: No Google Analytics, no error reporting pings, no telemetry.
- ❌ **No External CDNs**: All scripts, stylesheets, and icons are bundled locally in the distribution.
- ❌ **No Insecure Storage**: Passwords and decryption keys are held strictly in transient memory (`Uint8Array`) and are never written to `chrome.storage` or `localStorage`.

### Content Security Policy (CSP)

Both Chrome and Firefox distributions enforce an unyielding CSP:

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
}
```

---

## 📄 License

This project is licensed under the **Apache License, Version 2.0**.  
See the [LICENSE](LICENSE) file for complete details.

---

<div align="center">

**Built with security, privacy, and modern web standards.**  
*SecureVault is ready for unpacked installation in Chrome, Edge, Brave, and Firefox.*

</div>
