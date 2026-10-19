/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'ghost' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  title,
  'aria-label': ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
  };

  const variantClasses = {
    ghost:
      'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-[#A1AAA4] dark:hover:text-[#F8FAFC] dark:hover:bg-neutral-800/60',
    secondary:
      'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-[#16201A] dark:hover:bg-[#1F2C24] dark:text-[#F8FAFC] border border-neutral-200 dark:border-emerald-500/20',
    outline:
      'border border-neutral-300 dark:border-emerald-500/30 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-emerald-950/20',
    danger:
      'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={`inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
