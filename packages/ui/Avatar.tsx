"use client";

import React, { useState } from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  initials?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  initials,
  className = '',
}) => {
  const [error, setError] = useState(false);

  const getInitials = () => {
    if (initials) return initials.slice(0, 2).toUpperCase();
    return alt
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const classNames = [
    styles.avatar,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          onError={() => setError(true)}
        />
      ) : (
        <div className={styles.fallback}>{getInitials()}</div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
