import React, { useEffect, useRef } from 'react';
import { formatPrice } from '~/v4/social/utils/formatPrice';
import clsx from 'clsx';
import { Button } from '~/v4/core/components/AriaButton';
import { Pin } from '~/v4/icons/Pin';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import CloseIcon from '~/v4/icons/Close';
import styles from './LivestreamPinnedProduct.module.css';
import Trash from '~/v4/social/icons/trash';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';

interface LivestreamPinnedProductProps {
  pageId?: string;
  componentId?: string;
  productTag: Amity.MediaProductTag;
  onUnpin?: () => void;
  onRemove?: () => void;
  className?: string;
  isViewer?: boolean;
  onClosePinnedProduct?: () => void;
  sourceId?: string;
}

export function LivestreamPinnedProduct({
  pageId = '*',
  componentId = '*',
  productTag,
  onUnpin,
  onRemove,
  className,
  isViewer = true,
  sourceId = '',
  onClosePinnedProduct,
}: LivestreamPinnedProductProps) {
  const elementId = ELEMENT_ID.LIVESTREAM_PINNED_PRODUCT;

  const { accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const elementRef = useRef<HTMLDivElement>(null);

  const product = productTag.product;
  if (!product) return null;

  const unavailable = product.status === 'inactive' || product.isDeleted;

  const price = formatPrice(product.price, product.currency);

  const markAsClicked = () => {
    product.analytics.markAsClicked(accessibilityId, 'room', sourceId);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    isViewer && markAsClicked();
    if (!unavailable && product.productUrl) {
      window.open(product.productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const { isVisible } = useVisibilitySensor({
    threshold: 0.6,
    elementRef,
  });

  useEffect(() => {
    if (isVisible && isViewer) {
      product?.analytics?.markAsViewed(accessibilityId, 'room', sourceId);
    }
  }, [product, isVisible, accessibilityId, sourceId, isViewer]);

  return (
    <div
      ref={elementRef}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.livestreamPinnedProduct, className)}
      data-unavailable={unavailable}
      aria-disabled={unavailable}
    >
      {isViewer && (
        <Button
          type="button"
          aria-label="Close"
          variant="default"
          className={styles.livestreamPinnedProduct__closeButton}
          onPress={() => {
            onClosePinnedProduct?.();
          }}
        >
          <CloseIcon className={styles.livestreamPinnedProduct__closeIcon} />
        </Button>
      )}
      <div
        data-unavailable={unavailable}
        aria-disabled={unavailable}
        className={styles.livestreamPinnedProduct__thumbnailWrapper}
        onClick={handleLinkClick}
        style={{ cursor: unavailable ? 'default' : 'pointer' }}
        role="button"
        tabIndex={unavailable ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !unavailable) {
            e.preventDefault();
            handleLinkClick(e as any);
          }
        }}
      >
        <ProductImageThumbnail
          imageUrl={product.thumbnailUrl}
          alt={product.productName}
          unavailable={unavailable}
          size="medium"
          className={styles.livestreamPinnedProduct__thumbnail}
        />
        {unavailable && <div className={styles.livestreamPinnedProduct__unavailableOverlay} />}
      </div>
      <div className={styles.livestreamPinnedProduct__infoWrapper}>
        <Typography.CaptionBold
          data-unavailable={unavailable}
          className={styles.livestreamPinnedProduct__title}
          onClick={handleLinkClick}
          style={{ cursor: unavailable ? 'default' : 'pointer' }}
        >
          {product.productName}
        </Typography.CaptionBold>
        <div className={styles.livestreamPinnedProduct__bottomRow}>
          <Typography.Caption
            data-unavailable={unavailable}
            className={styles.livestreamPinnedProduct__price}
            onClick={handleLinkClick}
            style={{ cursor: unavailable ? 'default' : 'pointer' }}
          >
            {unavailable ? 'Unavailable' : price}
          </Typography.Caption>
          {isViewer ? (
            <div
              className={styles.livestreamPinnedProduct__unpinLink}
              aria-disabled={unavailable}
              tabIndex={unavailable ? -1 : 1}
              style={unavailable ? { pointerEvents: 'none', opacity: 0.5 } : {}}
            >
              <Button
                className={styles.livestreamPinnedProduct__unpinButton}
                aria-label="View product"
                color="primary"
                size="small"
                isDisabled={unavailable}
                onPress={() => {
                  markAsClicked();
                  window.open(product.productUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <Typography.CaptionBold
                  as="span"
                  className={styles.livestreamPinnedProduct__viewText}
                >
                  View
                </Typography.CaptionBold>
              </Button>
            </div>
          ) : unavailable ? (
            <Button
              className={styles.livestreamPinnedProduct__removeButton}
              onPress={() => {
                onRemove?.();
              }}
              aria-label="Remove product tag"
              variant="outlined"
              size="small"
              icon={<Trash />}
              iconClassName={styles.livestreamPinnedProduct__removeIcon}
            />
          ) : (
            <Button
              className={styles.livestreamPinnedProduct__unpinButton}
              onPress={() => {
                onUnpin?.();
              }}
              aria-label="Unpin product tag"
              variant="outlined"
              size="small"
              icon={<Pin />}
              iconClassName={styles.livestreamPinnedProduct__unpinIcon}
            >
              <Typography.CaptionBold
                as="span"
                className={styles.livestreamPinnedProduct__unpinText}
              >
                Unpin
              </Typography.CaptionBold>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
