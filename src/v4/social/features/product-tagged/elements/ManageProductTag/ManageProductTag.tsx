import React, { useEffect, useRef } from 'react';
import { Typography } from '~/v4/core/components';
import { ActionButton } from '~/v4/core/components/ActionButton/ActionButton';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './ManageProductTag.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import { TrashIcon } from '~/v4/icons/Trash';
import { Pin } from '~/v4/icons/Pin';
import { formatPrice } from '~/v4/social/utils/formatPrice';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';

export type RenderModeEnum = 'livestream' | 'playback';

export interface ManageProductTagProps {
  sourceType?: AnalyticsSourceTypeEnum;
  sourceId: string;
  productTag: Amity.ProductTag;
  isHost?: boolean;
  isPinned?: boolean;
  onRemove?: (productTag: Amity.ProductTag) => void;
  onTogglePin?: (productTag: Amity.ProductTag, isPinned: boolean) => void;
  pageId?: string;
  componentId?: string;
  isDisabled?: boolean;
  renderMode?: RenderModeEnum;
}

export function ManageProductTag({
  sourceType = AnalyticsSourceTypeEnum.POST,
  sourceId,
  productTag,
  isHost = false,
  isPinned = false,
  onRemove,
  onTogglePin,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isDisabled = false,
  renderMode = 'livestream',
}: ManageProductTagProps) {
  const elementId = ELEMENT_ID.MANAGE_PRODUCT_TAG;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  const elementRef = useRef<HTMLDivElement>(null);

  const product = productTag.product;
  const imageUrl = product?.thumbnailUrl;
  const productName = product?.productName;
  const price = formatPrice(product?.price, product?.currency);

  const handleMarkAsClick = () => {
    !isHost && product?.analytics?.markAsClicked(accessibilityId, sourceType, sourceId);
  };

  const { isVisible } = useVisibilitySensor({
    threshold: 0.6,
    elementRef,
  });

  useEffect(() => {
    if (isVisible && !isHost) {
      product?.analytics?.markAsViewed(accessibilityId, sourceType, sourceId);
    }
  }, [product, isVisible, accessibilityId, sourceType, sourceId, isHost]);

  return (
    <div
      className={
        renderMode === 'playback'
          ? `${styles.manageProductTag} ${styles.playback}`
          : styles.manageProductTag
      }
      style={themeStyles}
      data-test-id={accessibilityId}
      ref={elementRef}
    >
      <a
        href={product?.productUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={styles.manageProductTag__thumbnail}
        onClick={handleMarkAsClick}
      >
        <ProductImageThumbnail
          imageUrl={imageUrl}
          alt={productName}
          size="large"
          isPinned={isPinned}
        />
      </a>
      <div className={styles.manageProductTag__information}>
        <div className={styles.manageProductTag__content}>
          <a
            href={product?.productUrl}
            rel="noopener noreferrer"
            target="_blank"
            className={styles.manageProductTag__link}
            onClick={handleMarkAsClick}
          >
            <Typography.BodyBold as="p" className={styles.manageProductTag__title}>
              {productName}
            </Typography.BodyBold>
          </a>
          <div className={styles.manageProductTag__actions}>
            {price && (
              <Typography.Body as="p" className={styles.manageProductTag__price}>
                {price}
              </Typography.Body>
            )}
            {/* Only show buttons in livestream mode */}
            {renderMode === 'livestream' && (
              <>
                <ActionButton
                  className={styles.manageProductTag__removeButton}
                  onPress={() => onRemove?.(productTag)}
                  aria-label="Remove product tag"
                  defaultIcon={<TrashIcon />}
                  color="secondary"
                  size="small"
                />
                <Button
                  className={styles.manageProductTag__pinButton}
                  onPress={() => onTogglePin?.(productTag, !isPinned)}
                  aria-label={isPinned ? 'Unpin product' : 'Pin product'}
                  variant="outlined"
                  size="small"
                  icon={<Pin />}
                  isDisabled={isDisabled}
                >
                  <Typography.CaptionBold as="span">
                    {isPinned ? 'Unpin' : 'Pin'}
                  </Typography.CaptionBold>
                </Button>
              </>
            )}
            {/* Show View button in playback mode */}
            {!isHost && renderMode === 'playback' && (
              <Button
                className={styles.manageProductTag__viewButton}
                onPress={() => {
                  handleMarkAsClick();
                  if (product?.productUrl) {
                    window.open(product.productUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                isDisabled={!product?.productUrl}
                aria-label="View product"
              >
                <Typography.CaptionBold as="span">View</Typography.CaptionBold>
              </Button>
            )}

            {isHost && renderMode === 'playback' && (
              <ActionButton
                className={styles.manageProductTag__removeButton}
                onPress={() => onRemove?.(productTag)}
                aria-label="Remove product tag"
                defaultIcon={<TrashIcon />}
                color="secondary"
                size="small"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
