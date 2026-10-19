/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} rounded-2xl border bg-white text-[#17251B] border-[#DCE8DE] shadow-2xl dark:bg-[#101612] dark:border-emerald-500/20 dark:text-[#F8FAFC] overflow-hidden transform transition-all duration-200`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#DCE8DE] dark:border-emerald-500/15">
          <div>
            <h3 id="modal-title" className="text-base font-semibold">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#647067] dark:text-[#A1AAA4] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <IconButton aria-label="Close modal" onClick={onClose} size="sm">
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
