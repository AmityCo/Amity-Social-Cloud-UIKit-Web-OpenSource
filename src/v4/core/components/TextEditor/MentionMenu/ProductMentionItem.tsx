import React from 'react';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { Button } from '~/v4/core/components/AriaButton';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import styles from './ProductMentionItem.module.css';
import { Typography } from '~/v4/core/components';

export interface ProductMentionData {
  productId: string;
  displayName?: string;
  product?: Amity.Product;
}

type ProductMentionItemProps = {
  pageId?: string;
  isSelected: boolean;
  isAlreadyTagged?: boolean;
  onClick: (product: Amity.Product) => void;
  componentId?: string;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<ProductMentionData>;
};

export function ProductMentionItem({
  option,
  onClick,
  isSelected,
  isAlreadyTagged = false,
  onMouseEnter,
  pageId = '*',
  componentId = '*',
}: ProductMentionItemProps) {
  const product = option.data.product;

  if (!product) return null;

  return (
    <Button
      key={option.key}
      onPress={() => !isAlreadyTagged && onClick(product)}
      ref={option.setRefElement}
      aria-selected={isSelected}
      aria-disabled={isAlreadyTagged}
      onHoverStart={onMouseEnter}
      data-is-selected={isSelected}
      data-is-already-tagged={isAlreadyTagged}
      className={styles.productMentionItem__item}
      data-testid={`${pageId}/${componentId}/product_mention_item`}
      variant="text"
    >
      <ProductImageThumbnail
        imageUrl={product.thumbnailUrl}
        alt={product.productName}
        size="small"
        className={styles.productMentionItem__thumbnail}
        thumbnailMode={product.thumbnailMode}
      />
      <div className={styles.productMentionItem__content}>
        <Typography.BodyBold
          className={styles.productMentionItem__name}
          data-is-already-tagged={isAlreadyTagged}
        >
          {product.productName}
        </Typography.BodyBold>
        {isAlreadyTagged && (
          <Typography.Caption className={styles.productMentionItem__alreadyTagged}>
            Already tagged
          </Typography.Caption>
        )}
      </div>
    </Button>
  );
}
