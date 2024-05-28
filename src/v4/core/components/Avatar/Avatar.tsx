import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.css';

export interface AvatarProps {
  className?: string;
  avatar?: string | null;
  showOverlay?: boolean;
  onClick?: () => void;
  loading?: boolean;
  backgroundImage?: string | null;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar = ({
  className = '',
  avatar = null,
  showOverlay,
  onClick,
  loading,
  size = 'medium',
  backgroundImage,
  ...props
}: AvatarProps) => {
  const [visible, setVisible] = useState(false);
  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <div
      className={clsx(
        styles.avatarContainer,
        className,
        visible && styles.visible,
        onClick && styles.clickable,
        styles[size],
      )}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className={clsx(styles.skeleton, styles[`skeleton-${size}`])} />
      ) : avatar ? (
        showOverlay ? (
          <div className={clsx(styles.avatarOverlay, styles[`avatarOverlay-${size}`])}>
            <img
              className={clsx(styles.img, styles[`img-${size}`])}
              data-img={size}
              src={avatar}
              onError={onError}
              onLoad={onLoad}
              alt="Avatar"
            />
          </div>
        ) : (
          <img
            className={clsx(styles.img)}
            data-img={size}
            src={avatar}
            onError={onError}
            onLoad={onLoad}
            alt="Avatar"
          />
        )
      ) : null}
    </div>
  );
};
