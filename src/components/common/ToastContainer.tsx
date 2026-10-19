/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../../hooks/useToast';
import { IconButton } from './IconButton';

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200 animate-slide-up ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                : isError
                ? 'bg-red-950/90 border-red-500/40 text-red-100'
                : 'bg-[#101612]/95 border-emerald-500/20 text-[#F8FAFC]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-emerald-400" />}
            </div>

            <div className="flex-1 text-xs leading-relaxed">
              {toast.title && <p className="font-semibold">{toast.title}</p>}
              <p className={toast.title ? 'opacity-90' : 'font-medium'}>{toast.message}</p>
            </div>

            <IconButton
              aria-label="Dismiss toast"
              size="sm"
              onClick={() => onDismiss(toast.id)}
              className="text-inherit opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
};
