import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './ProductTag.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';

function formatPrice(price: number | undefined, currency: string | undefined): string {
  if (price == null) return '';

  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.toUpperCase(),
        trailingZeroDisplay: 'stripIfInteger',
      } as Intl.NumberFormatOptions).format(price);
    } catch {
      // Fallback if formatting fails
      return `${currency}${price}`;
    }
  }

  // Fallback for no currency
  return `$${price}`;
}

export interface ProductTagProps {
  product: Amity.Product;
  pageId?: string;
  componentId?: string;
}

export function ProductTag({
  product,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
}: ProductTagProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const imageUrl = product.thumbnailUrl;
  const price = formatPrice(product.price, product.currency);

  return (
    <div className={styles.productTag} style={themeStyles} data-test-id={accessibilityId}>
      <div className={styles.productTag__thumbnail}>
        <ProductImageThumbnail
          imageUrl={imageUrl}
          alt={product.productName || product.productId}
          size="large"
        />
      </div>
      <div className={styles.productTag__information}>
        <div className={styles.productTag__content}>
          <Typography.BodyBold as="p" className={styles.productTag__title}>
            {product.productName || product.productId}
          </Typography.BodyBold>
          {price && (
            <Typography.Caption as="p" className={styles.productTag__price}>
              {price}
            </Typography.Caption>
          )}
        </div>
      </div>
    </div>
  );
}
