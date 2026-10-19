/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = 'dark' | 'light';
export type LayoutMode = 'dashboard' | 'popup';

export interface UserSettings {
  theme: ThemeMode;
  layoutMode: LayoutMode;
  defaultIterations: number;
  confirmPasswordOnEncrypt: boolean;
  recordSessionHistory: boolean;
}

export type ActivePage = 'dashboard' | 'encrypt' | 'decrypt' | 'history' | 'settings' | 'about';
