import React from 'react';
import styles from './Avatar.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

export interface AvatarProps {
  pageId?: string;
  componentId?: string;
  avatarUrl?: string | null;
  defaultImage: React.ReactNode;
  onClick?: () => void;
}

export const Avatar = ({
  pageId = '*',
  componentId = '*',
  avatarUrl,
  defaultImage,
  onClick,
}: AvatarProps) => {
  const elementId = 'avatar';

  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  return (
    <div
      data-qa-anchor={accessibilityId}
      className={styles.avatarContainer}
      data-clickable={!!onClick}
      onClick={onClick}
    >
      {avatarUrl ? (
        // TODO: add handler if cannot fetch the url
        <img className={styles.avatarImage} src={avatarUrl} alt="Avatar" />
      ) : (
        defaultImage
      )}
    </div>
  );
};
