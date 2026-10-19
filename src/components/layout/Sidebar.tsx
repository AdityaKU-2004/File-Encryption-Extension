/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Lock,
  Unlock,
  History,
  Settings,
  Info,
  Shield,
  Smartphone,
} from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../config/encryptionConfig';
import { ActivePage, LayoutMode } from '../../types/settings';

export interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  layoutMode: LayoutMode;
  onToggleLayoutMode: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  layoutMode,
  onToggleLayoutMode,
  historyCount,
}) => {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'encrypt' as ActivePage, label: 'Encrypt Text', icon: <Lock className="w-4 h-4" /> },
    { id: 'decrypt' as ActivePage, label: 'Decrypt Text', icon: <Unlock className="w-4 h-4" /> },
    {
      id: 'history' as ActivePage,
      label: 'Encryption History',
      icon: <History className="w-4 h-4" />,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    { id: 'settings' as ActivePage, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about' as ActivePage, label: 'About SecureVault', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r bg-white/70 dark:bg-[#080B09]/90 border-[#DCE8DE] dark:border-emerald-500/15 backdrop-blur-xl h-screen sticky top-0 p-5">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-base text-[#17251B] dark:text-[#F8FAFC]">
              {APP_NAME}
            </h1>
            <p className="text-[11px] text-[#647067] dark:text-[#A1AAA4]">
              Encryption Extension
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-[#16201A] text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-600 dark:border-emerald-500'
                    : 'text-[#647067] dark:text-[#A1AAA4] hover:bg-neutral-100/60 dark:hover:bg-[#101612] hover:text-[#17251B] dark:hover:text-[#F8FAFC]'
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

      {/* Sidebar bottom */}
      <div className="space-y-3 pt-4 border-t border-[#DCE8DE] dark:border-emerald-500/15">
        {/* Quick layout toggle */}
        <button
          type="button"
          onClick={onToggleLayoutMode}
          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#DCE8DE] dark:border-emerald-500/15 text-xs text-[#647067] dark:text-[#A1AAA4] hover:bg-neutral-50 dark:hover:bg-[#101612] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Popup Preview</span>
          </div>
          <span className="text-[10px] font-mono opacity-70">390px</span>
        </button>

        {/* Privacy-first badge & version */}
        <div className="px-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            <Shield className="w-3 h-3 shrink-0" />
            <span>100% Client-Side Privacy</span>
          </div>
          <p className="text-[10px] text-[#647067] dark:text-[#64746B] mt-0.5 font-mono">
            SecureVault v{APP_VERSION}
          </p>
        </div>
      </div>
    </aside>
  );
};
