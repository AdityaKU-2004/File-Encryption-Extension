/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHistory } from '../../hooks/useHistory';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { AboutPage } from '../../pages/AboutPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ActivePage, LayoutMode } from '../../types/settings';
import { ToastContainer } from '../common/ToastContainer';
import { DecryptWorkspace } from '../decryption/DecryptWorkspace';
import { EncryptWorkspace } from '../encryption/EncryptWorkspace';
import { HistoryList } from '../history/HistoryList';
import { SettingsSection } from '../settings/SettingsSection';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { PopupLayout } from './PopupLayout';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { toasts, showToast, dismissToast } = useToast();
  const { history, addEntry, clearHistory, removeEntry, loadDemoData, stats } = useHistory();

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [defaultIterations, setDefaultIterations] = useState(100_000);
  const [recordHistory, setRecordHistory] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  const toggleLayoutMode = () => {
    setLayoutMode((prev) => (prev === 'dashboard' ? 'popup' : 'dashboard'));
  };

  const handleRecordHistory = (entry: Parameters<typeof addEntry>[0]) => {
    if (recordHistory) {
      addEntry(entry);
    }
  };

  // If Popup Mode is active, render the compact extension view
  if (layoutMode === 'popup') {
    return (
      <div className="min-h-screen bg-[#080B09] text-[#F8FAFC]">
        <PopupLayout
          theme={theme}
          onToggleTheme={toggleTheme}
          onSwitchToDashboard={() => setLayoutMode('dashboard')}
          onRecordHistory={handleRecordHistory}
          onNotify={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // Full-Page Development Dashboard
  return (
    <div className="min-h-screen flex bg-[#F7FAF7] text-[#17251B] dark:bg-[#080B09] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Sidebar for Desktop (≥1024px) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          layoutMode={layoutMode}
          onToggleLayoutMode={toggleLayoutMode}
          historyCount={history.length}
        />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
        layoutMode={layoutMode}
        onToggleLayoutMode={toggleLayoutMode}
        historyCount={history.length}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activePage={activePage}
          theme={theme}
          onToggleTheme={toggleTheme}
          layoutMode={layoutMode}
          onToggleLayoutMode={toggleLayoutMode}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              onNavigate={setActivePage}
              recentActivity={history}
              stats={stats}
              onClearHistory={clearHistory}
              onLoadDemoHistory={loadDemoData}
            />
          )}

          {activePage === 'encrypt' && (
            <EncryptWorkspace
              onRecordHistory={handleRecordHistory}
              onNotify={showToast}
              defaultIterations={defaultIterations}
            />
          )}

          {activePage === 'decrypt' && (
            <DecryptWorkspace
              onRecordHistory={handleRecordHistory}
              onNotify={showToast}
            />
          )}

          {activePage === 'history' && (
            <HistoryList
              entries={history}
              onClear={clearHistory}
              onRemoveEntry={removeEntry}
              onLoadDemo={loadDemoData}
              onNavigateToEncrypt={() => setActivePage('encrypt')}
            />
          )}

          {activePage === 'settings' && (
            <SettingsSection
              theme={theme}
              onThemeChange={setTheme}
              layoutMode={layoutMode}
              onLayoutModeChange={setLayoutMode}
              defaultIterations={defaultIterations}
              onDefaultIterationsChange={setDefaultIterations}
              recordHistory={recordHistory}
              onRecordHistoryChange={setRecordHistory}
              autoDownload={autoDownload}
              onAutoDownloadChange={setAutoDownload}
              onClearHistory={clearHistory}
              onNotify={showToast}
              onNavigateToAbout={() => setActivePage('about')}
            />
          )}

          {activePage === 'about' && <AboutPage />}
        </main>
      </div>

      {/* Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
