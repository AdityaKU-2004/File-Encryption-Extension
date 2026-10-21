/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { useHistory } from '../hooks/useHistory';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { PopupLayout } from '../components/layout/PopupLayout';
import { ToastContainer } from '../components/common/ToastContainer';
import { openDashboardTab } from './browser';
import '../index.css';

const ExtensionPopupApp: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toasts, showToast, dismissToast } = useToast();
  const { addEntry } = useHistory();

  return (
    <div className="w-[390px] min-h-[520px] bg-[#F7FAF7] dark:bg-[#080B09] text-[#17251B] dark:text-[#F8FAFC]">
      <PopupLayout
        theme={theme}
        onToggleTheme={toggleTheme}
        onSwitchToDashboard={openDashboardTab}
        onRecordHistory={addEntry}
        onNotify={showToast}
        isStandalonePopup={true}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ExtensionPopupApp />
    </React.StrictMode>
  );
}
