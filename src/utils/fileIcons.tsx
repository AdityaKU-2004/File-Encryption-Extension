/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode2,
  FileArchive,
  Image,
  Video,
  Music,
  Presentation,
  Shield,
  File,
} from 'lucide-react';
import { FileCategory } from '../types/file';

export interface FileIconProps {
  category: FileCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FileIcon: React.FC<FileIconProps> = ({
  category,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  const iconClass = `${sizeClasses[size]} ${className}`;

  switch (category) {
    case 'encrypted':
      return <Shield className={`${iconClass} text-emerald-500`} />;
    case 'video':
      return <Video className={`${iconClass} text-purple-500`} />;
    case 'image':
      return <Image className={`${iconClass} text-blue-500`} />;
    case 'audio':
      return <Music className={`${iconClass} text-pink-500`} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />;
    case 'presentation':
      return <Presentation className={`${iconClass} text-orange-500`} />;
    case 'document':
      return <FileText className={`${iconClass} text-indigo-500`} />;
    case 'archive':
      return <FileArchive className={`${iconClass} text-amber-500`} />;
    case 'code':
      return <FileCode2 className={`${iconClass} text-cyan-500`} />;
    default:
      return <File className={`${iconClass} text-neutral-400`} />;
  }
};
