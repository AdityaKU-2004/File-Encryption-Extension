/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  elevation?: 'flat' | 'raised';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  elevation = 'raised',
  ...props
}) => {
  const baseClasses =
    'rounded-xl border transition-all duration-200 backdrop-blur-md glass-panel';

  const themeClasses =
    'bg-white/90 border-[#DCE8DE] text-[#17251B] dark:bg-[#101612]/80 dark:border-emerald-500/15 dark:text-[#F8FAFC]';

  const shadowClasses =
    elevation === 'raised'
      ? 'shadow-[0_4px_20px_-4px_rgba(22,163,74,0.06)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]'
      : 'shadow-none';

  const glowClasses = glow
    ? 'dark:hover:border-emerald-500/35 hover:border-emerald-600/30 dark:shadow-[0_0_25px_-5px_rgba(34,197,94,0.12)]'
    : '';

  return (
    <div
      className={`${baseClasses} ${themeClasses} ${shadowClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
