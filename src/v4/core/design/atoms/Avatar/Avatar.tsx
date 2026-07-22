import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { User } from '~/v4/core/design/icons/User';
import { Camera } from '~/v4/core/design/icons/Camera';
import styles from './Avatar.module.css';

export type AvatarVariant = 'image' | 'icon' | 'text';
export type AvatarShape = 'rounded' | 'squared';
export type AvatarSize = 16 | 24 | 28 | 32 | 40 | 56 | 64 | 120;
export type AvatarState = 'default' | 'hover' | 'skeleton';
export type AvatarBorderWidth = 0 | 1 | 2 | 3 | 4;

export type AvatarProps = {
  variant?: AvatarVariant;
  imageUrl?: string;
  initials?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  state?: AvatarState;
  borderWidth?: AvatarBorderWidth;
  indicator?: React.ReactNode;
  label?: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    variant = 'icon',
    imageUrl,
    initials,
    shape = 'rounded',
    size = 40,
    state = 'default',
    borderWidth = 0,
    indicator,
    label,
    alt = '',
    onClick,
    className,
  },
  ref,
) {
  const content =
    state === 'skeleton' ? null : variant === 'image' && imageUrl ? (
      <img src={imageUrl} alt={alt} className={styles.avatar__img} />
    ) : variant === 'text' && initials ? (
      <span className={styles.avatar__initials}>{initials}</span>
    ) : (
      <User.Solid className={styles.avatar__glyph} />
    );

  return (
    <div ref={ref} className={clsx(styles.avatar, className)} onClick={onClick}>
      <div className={styles.avatar__frameWrapper}>
        <div
          className={styles.avatar__frame}
          data-shape={shape}
          data-size={size}
          data-state={state}
          style={{ '--avatar-border-width': `${borderWidth / 16}rem` } as React.CSSProperties}
        >
          {content}
          {state === 'hover' ? (
            <span className={styles.avatar__hoverOverlay}>
              <Camera.Regular className={styles.avatar__hoverGlyph} />
            </span>
          ) : null}
        </div>
        {indicator ? <span className={styles.avatar__indicator}>{indicator}</span> : null}
      </div>
      {label ? <span className={styles.avatar__label}>{label}</span> : null}
    </div>
  );
});
