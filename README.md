# SecureVault — Cross-Browser File Encryption Extension

> **"Your files. Your privacy. Your control."**

SecureVault is a high-security, client-side browser extension and web application for encrypting and decrypting arbitrary files locally using authenticated AES-256-GCM encryption with PBKDF2-SHA-256 key derivation.

All cryptographic operations occur entirely in-memory within the local browser environment. No plaintext, passwords, keys, or ciphertext are ever sent to remote servers or stored unencrypted.

---

## 🚀 Quick Start & Build Commands

### Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the standard Vite development server on port 3000 |
| `npm run build` | **Compiles both browser extensions** (`chrome-dist/` and `firefox-dist/`) and validates structure |
| `npm run build:chrome` | Builds the Chrome / Chromium extension into `chrome-dist/` |
| `npm run build:firefox` | Builds the Mozilla Firefox extension into `firefox-dist/` |
| `npm run typecheck` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run preview` | Previews the web build |
| `npm run clean` | Cleans all build artifacts (`dist`, `chrome-dist`, `firefox-dist`) |

---

## 📦 Extension Output Structure

Running `npm run build` generates two self-contained, independently installable unpacked extensions:

```
chrome-dist/
├── manifest.json         # Chrome Manifest V3 configuration
├── popup.html            # Extension popup (390px compact UI)
├── dashboard.html        # Full-page cybersecurity workspace tab
├── icons/                # 16x16, 32x32, 48x48, 128x128 PNG icons
└── assets/               # Bundled JavaScript and Tailwind CSS

firefox-dist/
├── manifest.json         # Firefox Manifest V3 (with Gecko ID)
├── popup.html            # Extension popup (390px compact UI)
├── dashboard.html        # Full-page cybersecurity workspace tab
├── icons/                # 16x16, 32x32, 48x48, 128x128 PNG icons
└── assets/               # Bundled JavaScript and Tailwind CSS
```

---

## 🛠️ How to Install the Extension

### Google Chrome & Chromium Browsers (Brave, Edge, Opera, Vivaldi)

1. Run the build command in the project terminal:
   ```bash
   npm run build
   ```
2. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select the **`chrome-dist/`** folder from the project directory.
6. Pin SecureVault to your browser toolbar for quick access.

### Mozilla Firefox

1. Run the build command in the project terminal:
   ```bash
   npm run build
   ```
2. Open Mozilla Firefox and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```
3. Under **Temporary Extensions**, click **Load Temporary Add-on...**.
4. Select either **`manifest.json`** inside the **`firefox-dist/`** folder or any file inside `firefox-dist/`.
5. SecureVault is now installed and active in Firefox.

---

## 🛡️ Cryptographic & Architecture Highlights

- **Authenticated Encryption**: Uses AES-256-GCM with a 128-bit authentication tag to prevent tampering.
- **Key Derivation (KDF)**: PBKDF2 with SHA-256 and configurable iterations (100,000+ default) using a cryptographically secure 128-bit salt per file.
- **Container Format (`.svault`)**: Custom binary format packing magic bytes `SVAULT\x01`, KDF metadata, initialization vector (IV), authenticated payload, and original filename/MIME restoration parameters.
- **Zero Remote Dependencies**: Strict Content Security Policy (`script-src 'self'; object-src 'self'`). No tracking, no CDNs, no external APIs.
- **Dual UI Modes**:
  - **Popup Mode**: Compact 390px interface for rapid single-file encryption/decryption, password generation, and quick settings.
  - **Dashboard Mode**: Full-featured security workspace with batch queues, detailed file inspection, cryptographic parameter tuning, and session audit history.
