import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { isImageAvatar, getAvatarInitial } from '../../utils/avatarUtils';

export interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  id?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'custom';
  rounded?: 'rounded-full' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-xl' | 'rounded-lg';
  className?: string;
  alt?: string;
  showDefaultIcon?: boolean;
}

const sizeClasses: Record<string, { container: string; text: string; icon: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[11px]', icon: 'w-3 h-3' },
  sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', text: 'text-base', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', text: 'text-xl', icon: 'w-6 h-6' },
  xl: { container: 'w-16 h-16', text: 'text-2xl', icon: 'w-8 h-8' },
  '2xl': { container: 'w-20 h-20', text: 'text-4xl', icon: 'w-10 h-10' },
  '3xl': { container: 'w-24 h-24', text: 'text-5xl', icon: 'w-12 h-12' },
  custom: { container: '', text: '', icon: 'w-5 h-5' }
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  id,
  size = 'md',
  rounded = 'rounded-2xl',
  className = '',
  alt,
  showDefaultIcon = false
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeConfig = sizeClasses[size] || sizeClasses.md;

  const isImage = isImageAvatar(avatar) && !hasImageError;
  const initial = getAvatarInitial(name, id);

  // If avatar is an image data URL / web URL and hasn't failed to load
  if (isImage && avatar) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-gray-100 ${sizeConfig.container} ${rounded} ${className}`}
      >
        <img
          src={avatar}
          alt={alt || name || 'Avatar'}
          onError={() => setHasImageError(true)}
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />
      </div>
    );
  }

  // Check if avatar is strictly a short emoji or symbol (NEVER render base64 or raw paths as text)
  const isShortEmoji = Boolean(
    avatar &&
    avatar.trim().length > 0 &&
    avatar.trim().length <= 6 &&
    !isImageAvatar(avatar) &&
    !avatar.includes('/') &&
    !avatar.includes(';') &&
    !avatar.includes(':') &&
    !avatar.includes('+') &&
    !avatar.includes('=') &&
    !avatar.includes(',')
  );

  // If avatar is an emoji or short symbol
  if (isShortEmoji && avatar) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 select-none bg-teal-50/90 text-teal-900 border border-teal-100/70 shadow-2xs ${sizeConfig.container} ${sizeConfig.text} ${rounded} ${className}`}
      >
        <span>{avatar.trim()}</span>
      </div>
    );
  }

  // Fallback: Default Avatar (Initial letter of name/ID or user icon on friendly gradient)
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold tracking-wide shadow-2xs ${sizeConfig.container} ${rounded} ${className}`}
      title={name || id || 'Tài khoản'}
    >
      {showDefaultIcon ? (
        <UserIcon className={sizeConfig.icon} />
      ) : (
        <span className={sizeConfig.text}>{initial}</span>
      )}
    </div>
  );
};
