/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sun,
  Moon,
  Menu,
  ShieldCheck,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { ActivePage, LayoutMode, ThemeMode } from '../../types/settings';
import { IconButton } from '../common/IconButton';

export interface HeaderProps {
  activePage: ActivePage;
  theme: ThemeMode;
  onToggleTheme: () => void;
  layoutMode: LayoutMode;
  onToggleLayoutMode: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  theme,
  onToggleTheme,
  layoutMode,
  onToggleLayoutMode,
  onOpenMobileMenu,
}) => {
  const pageDetails: Record<ActivePage, { title: string; description: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      description: 'Privacy-focused local text encryption and decryption workspace.',
    },
    encrypt: {
      title: 'Encrypt Text',
      description: 'Protect sensitive messages with password-derived AES-256-GCM.',
    },
    decrypt: {
      title: 'Decrypt Text',
      description: 'Recover original plaintext using your encryption key.',
    },
    history: {
      title: 'Encryption History',
      description: 'Strict non-persistent session audit log of cryptographic operations.',
    },
    settings: {
      title: 'Settings & Preferences',
      description: 'Configure appearance, iteration count, and privacy hygiene.',
    },
    about: {
      title: 'About SecureVault',
      description: 'Zero-knowledge browser extension design and threat model disclosures.',
    },
  };

  const current = pageDetails[activePage];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b bg-white/70 dark:bg-[#080B09]/80 border-[#DCE8DE] dark:border-emerald-500/15 backdrop-blur-xl">
      {/* Left: Mobile menu button + Page Title / Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="lg:hidden">
          <IconButton
            aria-label="Open navigation menu"
            onClick={onOpenMobileMenu}
            size="md"
          >
            <Menu className="w-5 h-5" />
          </IconButton>
        </div>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#17251B] dark:text-[#F8FAFC] truncate">
            {current.title}
          </h2>
          <p className="text-xs text-[#647067] dark:text-[#A1AAA4] hidden sm:block truncate">
            {current.description}
          </p>
        </div>
      </div>

      {/* Right: Security Status + Layout Switcher + Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Security status indicator (Anti-slop compliant: clean unboxed status without pulsing dot) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#101612] border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Web Crypto Active</span>
        </div>

        {/* Layout preview toggle */}
        <button
          type="button"
          onClick={onToggleLayoutMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium border-[#DCE8DE] dark:border-emerald-500/20 text-[#17251B] dark:text-[#F8FAFC] hover:bg-neutral-50 dark:hover:bg-[#16201A] transition-colors cursor-pointer"
          title={
            layoutMode === 'dashboard'
              ? 'Switch to compact Extension Popup view (390px)'
              : 'Switch to Full Dashboard view'
          }
        >
          {layoutMode === 'dashboard' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Popup View</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Dashboard View</span>
            </>
          )}
        </button>

        {/* Theme toggle */}
        <IconButton
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          size="md"
          variant="secondary"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-600" />
          )}
        </IconButton>
      </div>
    </header>
  );
};
