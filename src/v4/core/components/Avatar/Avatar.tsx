import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  avatarUrl?: string | null;
  defaultImage: React.ReactNode;
  onClick?: () => void;
}

export const Avatar = ({ avatarUrl, defaultImage, onClick }: AvatarProps) => {
  return (
    <div className={styles.avatarContainer} data-clickable={!!onClick} onClick={onClick}>
      {avatarUrl ? (
        // TODO: add handler if cannot fetch the url
        <img className={styles.avatarImage} src={avatarUrl} alt="Avatar" />
      ) : (
        defaultImage
      )}
    </div>
  );
};
