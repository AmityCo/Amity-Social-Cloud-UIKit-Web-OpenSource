import React from 'react';
import styles from './ProductTagList.module.css';
import { Typography } from '~/v4/core/components';
import { CloseButton } from '~/v4/social/elements';
import { Divider, DividerType } from '~/v4/social/elements/Divider/Divider';
import { ProductTag } from '~/v4/social/features/product-tagged/elements';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import { DisplayModeEnum, DisplayMode } from '~/v4/social/types';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Button } from '~/v4/core/components/AriaButton';

export interface ProductTagListProps {
  pageId?: string;
  productTags: Amity.ProductTag[];
  displayMode: DisplayMode;
  onClose?: () => void;
  mode?: 'post' | 'livestream';
  pinnedProductId?: string;
}

export function ProductTagList({
  productTags,
  displayMode = DisplayModeEnum.MOBILE,
  pageId = PAGE_ID.WILD_CARD,
  onClose,
  mode = 'post',
  pinnedProductId,
}: ProductTagListProps) {
  const componentId = COMPONENT_ID.PRODUCT_TAG_LIST;
  const { AmityProducTagtListComponentBehavior } = usePageBehavior();
  const { config, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  if (!productTags || productTags.length === 0) {
    return null;
  }

  const handleClickProductLink = (productTag: Amity.ProductTag) => {
    if (AmityProducTagtListComponentBehavior?.onProductTagClick)
      return AmityProducTagtListComponentBehavior?.onProductTagClick({ productTag });
  };

  const sortedProductTags = React.useMemo(() => {
    if (mode !== 'livestream' || !pinnedProductId) return productTags;

    return [...productTags].sort((a, b) => {
      const aIsPinned = a.product?.productId === pinnedProductId;
      const bIsPinned = b.product?.productId === pinnedProductId;
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [productTags, pinnedProductId, mode]);

  return (
    <div className={styles.productTagList} data-testid={accessibilityId} data-display={displayMode}>
      <div className={styles.productTagList__header} data-display={displayMode}>
        <div className={styles.productTagList__title}>
          <Typography.TitleBold
            as="p"
            data-mode={mode}
            className={styles.productTagListHeader__text}
          >
            {mode === 'livestream'
              ? 'Products tagged'
              : config.text ?? 'Products tagged in this post'}
          </Typography.TitleBold>
        </div>
        {displayMode === DisplayModeEnum.DESKTOP && (
          <CloseButton
            pageId={pageId}
            componentId={componentId}
            onPress={onClose}
            className={styles.productTagList__closeButton}
          />
        )}
      </div>
      {displayMode === DisplayModeEnum.DESKTOP && (
        <Divider type={DividerType.FULL_WIDTH} className={styles.productTagList__divider} />
      )}
      <div className={styles.productTagList__content} data-display={displayMode}>
        {sortedProductTags.map((productTag) =>
          productTag.product ? (
            mode === 'livestream' ? (
              // In livestream mode, ProductTag has its own internal button, so don't wrap it
              <ProductTag
                key={productTag.product.productId}
                mode={mode}
                product={productTag.product}
                isPinned={productTag.product.productId === pinnedProductId}
                onPress={
                  productTag.product.status === 'inactive' || productTag.product.isDeleted
                    ? undefined
                    : () => handleClickProductLink?.(productTag)
                }
              />
            ) : (
              // In post mode, ProductTag doesn't have an internal button, so wrap it
              <Button
                key={productTag.product.productId}
                variant="default"
                isDisabled={
                  productTag.product.status === 'inactive' || productTag.product.isDeleted
                }
                onPress={
                  productTag.product.status === 'inactive' || productTag.product.isDeleted
                    ? undefined
                    : () => handleClickProductLink?.(productTag)
                }
              >
                <ProductTag
                  mode={mode}
                  product={productTag.product}
                  isPinned={false}
                  onPress={
                    productTag.product.status === 'inactive' || productTag.product.isDeleted
                      ? undefined
                      : () => handleClickProductLink?.(productTag)
                  }
                />
              </Button>
            )
          ) : null,
        )}
      </div>
    </div>
  );
}
