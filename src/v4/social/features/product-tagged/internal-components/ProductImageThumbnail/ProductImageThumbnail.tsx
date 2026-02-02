import clsx from 'clsx';
import React, { useState } from 'react';
import { ImageIcon } from '~/v4/icons/Image';
import styles from './ProductImageThumbnail.module.css';

export interface ProductImageThumbnailProps {
  imageUrl?: string;
  alt?: string;
  unavailable?: boolean;
  size?: 'large' | 'medium' | 'small' | 'tiny';
  className?: string;
}

export function ProductImageThumbnail({
  imageUrl,
  alt = '',
  unavailable = false,
  size = 'large',
  className = '',
}: ProductImageThumbnailProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const isEmptyState = !imageUrl || hasImageError;

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <div className={clsx(styles.productImageThumbnail, className)} data-size={size}>
      {isEmptyState ? (
        <div className={styles.productImageThumbnail__emptyState}>
          <ImageIcon className={styles.productImageThumbnail__icon} />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className={styles.productImageThumbnail__image}
          onError={handleImageError}
        />
      )}
      {unavailable && (
        <div className={styles.productImageThumbnail__overlay}>
          <div className={styles.productImageThumbnail__overlayBackground} />
        </div>
      )}
    </div>
  );
}
