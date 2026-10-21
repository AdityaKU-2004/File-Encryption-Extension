/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppShell } from '../components/layout/AppShell';
import '../index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppShell initialLayoutMode="dashboard" />
    </React.StrictMode>
  );
}
