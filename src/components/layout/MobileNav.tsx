/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Lock,
  Unlock,
  History,
  Settings,
  Info,
  Shield,
  X,
  Smartphone,
} from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../config/encryptionConfig';
import { ActivePage, LayoutMode } from '../../types/settings';
import { IconButton } from '../common/IconButton';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  layoutMode: LayoutMode;
  onToggleLayoutMode: () => void;
  historyCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activePage,
  onNavigate,
  layoutMode,
  onToggleLayoutMode,
  historyCount,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'encrypt' as ActivePage, label: 'Encrypt Files', icon: <Lock className="w-4 h-4" /> },
    { id: 'decrypt' as ActivePage, label: 'Decrypt Files', icon: <Unlock className="w-4 h-4" /> },
    {
      id: 'history' as ActivePage,
      label: 'File History',
      icon: <History className="w-4 h-4" />,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    { id: 'settings' as ActivePage, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about' as ActivePage, label: 'About SecureVault', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-72 max-w-[85vw] h-full bg-white dark:bg-[#080B09] border-r border-[#DCE8DE] dark:border-emerald-500/20 p-5 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DE] dark:border-emerald-500/15">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#17251B] dark:text-[#F8FAFC]">
                  {APP_NAME}
                </span>
                <span className="block text-[10px] text-[#647067] dark:text-[#A1AAA4]">
                  v{APP_VERSION}
                </span>
              </div>
            </div>

            <IconButton aria-label="Close navigation menu" onClick={onClose} size="sm">
              <X className="w-4 h-4" />
            </IconButton>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-[#647067] dark:text-[#A1AAA4] hover:bg-neutral-100 dark:hover:bg-[#101612]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="space-y-3 pt-4 border-t border-[#DCE8DE] dark:border-emerald-500/15">
          <button
            type="button"
            onClick={() => {
              onToggleLayoutMode();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 text-xs text-[#647067] dark:text-[#A1AAA4] hover:bg-neutral-50 dark:hover:bg-[#101612] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Switch to Popup View</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
