import React from 'react';
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

export type RenderModeEnum = 'livestream' | 'playback';

export interface ManageProductTagProps {
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

  const product = productTag.product;
  const imageUrl = product?.thumbnailUrl;
  const productName = product?.productName;
  const price = formatPrice(product?.price, product?.currency);

  return (
    <div
      className={
        renderMode === 'playback'
          ? `${styles.manageProductTag} ${styles.playback}`
          : styles.manageProductTag
      }
      style={themeStyles}
      data-test-id={accessibilityId}
    >
      <a
        href={product?.productUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={styles.manageProductTag__thumbnail}
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
              <a
                className={styles.manageProductTag__viewButtonLink}
                href={product?.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!product?.productUrl}
                style={{
                  pointerEvents: !product?.productUrl ? 'none' : 'auto',
                  opacity: !product?.productUrl ? 0.5 : 1,
                }}
              >
                <Button className={styles.manageProductTag__viewButton}>
                  <Typography.CaptionBold as="span">View</Typography.CaptionBold>
                </Button>
              </a>
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
