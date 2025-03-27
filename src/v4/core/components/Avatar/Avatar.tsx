import React from 'react';
import styles from './Avatar.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';

export interface AvatarProps {
  pageId?: string;
  componentId?: string;
  avatarUrl?: string | null;
  defaultImage: React.ReactNode;
  onClick?: () => void;
  imgClassName?: string;
  containerClassName?: string;
}

export const Avatar = ({
  pageId = '*',
  componentId = '*',
  avatarUrl,
  defaultImage,
  onClick,
  imgClassName,
  containerClassName,
}: AvatarProps) => {
  const elementId = 'avatar';

  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  return (
    <div
      data-testid={accessibilityId}
      className={clsx(styles.avatarContainer, containerClassName)}
      data-clickable={!!onClick}
      onClick={onClick}
    >
      {avatarUrl ? (
        // TODO: add handler if cannot fetch the url
        <img className={clsx(styles.avatarImage, imgClassName)} src={avatarUrl} alt="Avatar" />
      ) : (
        defaultImage
      )}
    </div>
  );
};
