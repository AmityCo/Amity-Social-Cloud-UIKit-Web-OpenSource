import clsx from 'clsx';
import React, { useState } from 'react';
import { ImageFailedThumbnail } from '~/v4/icons/Image';
import { PinStraightFilled } from '~/v4/icons/PinStraightFilled';
import { Typography } from '~/v4/core/components';
import styles from './ProductImageThumbnail.module.css';
import { useTheme } from '~/v4/core/providers/ThemeProvider';

export interface ProductImageThumbnailProps {
  imageUrl?: string;
  alt?: string;
  unavailable?: boolean;
  isPinned?: boolean;
  size?: 'large' | 'medium' | 'small';
  className?: string;
  theme?: 'light' | 'dark';
  thumbnailMode?: 'fit' | 'fill';
}

export function ProductImageThumbnail({
  imageUrl,
  alt = '',
  unavailable = false,
  isPinned = false,
  size = 'large',
  className = '',
  thumbnailMode = 'fill',
  theme,
}: ProductImageThumbnailProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const { currentTheme } = useTheme();
  const isEmptyState = !imageUrl || hasImageError;

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <div className={clsx(styles.productImageThumbnail, className)} data-size={size}>
      {isEmptyState ? (
        <div className={styles.productImageThumbnail__emptyState}>
          <ImageFailedThumbnail className={styles.productImageThumbnail__icon} data-size={size} />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className={clsx(styles.productImageThumbnail__image, {
            [styles.productImageThumbnail__imageFit]: thumbnailMode === 'fit',
            [styles.productImageThumbnail__imageFill]: thumbnailMode === 'fill',
          })}
          onError={handleImageError}
        />
      )}
      {unavailable && (
        <div className={styles.productImageThumbnail__overlay}>
          <div
            className={clsx(styles.productImageThumbnail__overlayBackground)}
            data-theme={theme ?? currentTheme}
          />
        </div>
      )}
      {isPinned && (
        <div className={styles.productImageThumbnail__pinnedBanner}>
          <PinStraightFilled className={styles.productImageThumbnail__pinnedIcon} />
          <Typography.CaptionBold as="span" className={styles.productImageThumbnail__pinnedText}>
            Pinned
          </Typography.CaptionBold>
        </div>
      )}
    </div>
  );
}
