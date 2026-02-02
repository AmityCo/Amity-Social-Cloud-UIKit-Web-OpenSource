import React from 'react';
import { Typography } from '~/v4/core/components';
import { ActionButton } from '~/v4/core/components/ActionButton/ActionButton';
import styles from './ProductTagSelectedItem.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import CloseIcon from '~/v4/icons/Close';

export interface ProductTagSelectedItemProps {
  productTag: Amity.ProductTag;
  onClick?: (tag: Amity.ProductTag) => void;
  pageId?: string;
  componentId?: string;
}

export function ProductTagSelectedItem({
  productTag,
  onClick,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
}: ProductTagSelectedItemProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_SELECTED_ITEM;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const product = productTag.product;
  const imageUrl = product?.thumbnailUrl;
  const productName = product?.productName;

  return (
    <div
      className={styles.productTagSelectedItem}
      style={themeStyles}
      data-test-id={accessibilityId}
    >
      <ProductImageThumbnail imageUrl={imageUrl} alt={productName} size="medium" />
      <Typography.BodyBold as="p" className={styles.productTagSelectedItem__name}>
        {productName}
      </Typography.BodyBold>
      <ActionButton
        className={styles.productTagSelectedItem__removeButton}
        onPress={() => onClick?.(productTag)}
        aria-label="Remove product tag"
        defaultIcon={<CloseIcon />}
        color="tertiary"
        size="small"
      />
    </div>
  );
}
