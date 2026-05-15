import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Checkbox } from '~/v4/core/components/AriaCheckbox/Checkbox';
import styles from './ProductTagSelectionItem.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';

export interface ProductTagSelectionItemProps {
  product: Amity.Product;
  isSelected: boolean;
  onChange: (selected: boolean) => void;
  pageId?: string;
  componentId?: string;
  isDisabled: boolean;
  isAlreadyTagged?: boolean;
}

export function ProductTagSelectionItem({
  product,
  isSelected,
  onChange,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isDisabled,
  isAlreadyTagged = false,
}: ProductTagSelectionItemProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_SELECTION;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const imageUrl = product.thumbnailUrl;
  const productName = product.productName || product.productId;
  const unavailable = product.status === 'archived';

  return (
    <Checkbox
      isSelected={isSelected || isAlreadyTagged}
      onChange={onChange}
      isDisabled={isDisabled || unavailable || isAlreadyTagged}
      aria-label={`Select ${productName}`}
      className={styles.productTagSelectionItem}
      checkboxIconClassname={styles.productTagSelectionItem__checkboxIcon}
      style={themeStyles}
      data-test-id={accessibilityId}
      data-unavailable={unavailable}
      data-already-tagged={isAlreadyTagged}
      label={
        <div className={styles.productTagSelectionItem__labelWrapper}>
          <ProductImageThumbnail
            imageUrl={imageUrl}
            alt={productName}
            size="medium"
            unavailable={unavailable}
            className={styles.productTagSelectionItem__imageThumbnail}
            thumbnailMode={product.thumbnailMode}
          />
          <div className={styles.productTagSelectionItem__content}>
            <div className={styles.productTagSelectionItem__contentText}>
              {unavailable && (
                <Typography.Caption
                  as="p"
                  className={styles.productTagSelectionItem__unavailableLabel}
                >
                  {useString('amity_social_tagged_products_deleted_info')}
                </Typography.Caption>
              )}
              <Typography.Body
                as="p"
                className={styles.productTagSelectionItem__name}
                data-already-tagged={isAlreadyTagged}
              >
                {productName}
              </Typography.Body>
              {isAlreadyTagged && (
                <Typography.Caption
                  as="p"
                  className={styles.productTagSelectionItem__alreadyTaggedLabel}
                >
                  {useString('amity_social_button_product_already_tagged')}
                </Typography.Caption>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
