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
}

export function ProductTagList({
  productTags,
  displayMode = DisplayModeEnum.MOBILE,
  pageId = PAGE_ID.WILD_CARD,
  onClose,
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

  return (
    <div className={styles.productTagList} data-testid={accessibilityId} data-display={displayMode}>
      <div className={styles.productTagList__header} data-display={displayMode}>
        <div className={styles.productTagList__title}>
          <Typography.TitleBold as="p" className={styles.productTagListHeader__text}>
            {config.text ?? 'Products tagged in this post'}
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
        {productTags.map(
          (productTag) =>
            productTag.product && (
              <Button variant="default" onPress={() => handleClickProductLink?.(productTag)}>
                <ProductTag key={productTag.product.productId} product={productTag.product} />
              </Button>
            ),
        )}
      </div>
    </div>
  );
}
