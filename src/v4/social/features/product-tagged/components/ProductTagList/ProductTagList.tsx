import React from 'react';
import styles from './ProductTagList.module.css';
import { Typography } from '~/v4/core/components';
import { CloseButton } from '~/v4/social/elements';
import { Divider, DividerType } from '~/v4/social/elements/Divider/Divider';
import { ProductTag } from '~/v4/social/features/product-tagged/elements';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import {
  DisplayModeEnum,
  DisplayMode,
  ProductTagListRenderMode,
  ProductTagListRenderModeEnum,
  LayoutVariant,
  LayoutVariantEnum,
} from '~/v4/social/types';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';

export interface ProductTagListProps {
  pageId?: string;
  productTags: Amity.ProductTag[];
  displayMode?: DisplayMode;
  onClose?: () => void;
  renderMode?: ProductTagListRenderMode;
  layout?: LayoutVariant;
  pinnedProductId?: string;
  sourceId?: string;
}

export function ProductTagList({
  productTags,
  displayMode = DisplayModeEnum.MOBILE,
  pageId = PAGE_ID.WILD_CARD,
  onClose,
  renderMode = ProductTagListRenderModeEnum.POST,
  layout = LayoutVariantEnum.LIST,
  pinnedProductId,
  sourceId,
}: ProductTagListProps) {
  const componentId = COMPONENT_ID.PRODUCT_TAG_LIST;
  const { AmityGlobalBehavior } = usePageBehavior();
  const { config, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  if (!productTags || productTags.length === 0) {
    return null;
  }

  const handleClickProductLink = (productTag: Amity.ProductTag) => {
    if (!productTag.product) return;
    if (renderMode === ProductTagListRenderModeEnum.LIVESTREAM) {
      return AmityGlobalBehavior?.onLivestreamProductTagClick?.({ product: productTag.product });
    }
    return AmityGlobalBehavior?.onPostProductTagClick?.({ product: productTag.product });
  };

  const sortedProductTags = React.useMemo(() => {
    if (renderMode !== ProductTagListRenderModeEnum.LIVESTREAM || !pinnedProductId)
      return productTags;

    return [...productTags].sort((a, b) => {
      const aIsPinned = a.product?.productId === pinnedProductId;
      const bIsPinned = b.product?.productId === pinnedProductId;
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [productTags, pinnedProductId, renderMode]);

  const headerTextMap = {
    [ProductTagListRenderModeEnum.LIVESTREAM]: 'Products tagged',
    [ProductTagListRenderModeEnum.IMAGE]: 'Products tagged in this photo',
    [ProductTagListRenderModeEnum.VIDEO]: 'Products tagged in this video',
    [ProductTagListRenderModeEnum.POST]: 'Products tagged in this post',
  };

  const headerText = config.text ?? headerTextMap[renderMode];

  return (
    <div className={styles.productTagList} data-testid={accessibilityId} data-display={displayMode}>
      <div className={styles.productTagList__header} data-display={displayMode}>
        {renderMode === ProductTagListRenderModeEnum.LIVESTREAM && (
          <div className={styles.productTagList__liveStream__spacing} />
        )}
        <div className={styles.productTagList__title}>
          <Typography.TitleBold
            as="p"
            data-display={displayMode}
            className={styles.productTagListHeader__text}
          >
            {headerText}
          </Typography.TitleBold>
        </div>
        {(displayMode === DisplayModeEnum.DESKTOP ||
          renderMode === ProductTagListRenderModeEnum.LIVESTREAM) && (
          <CloseButton
            pageId={pageId}
            componentId={componentId}
            onPress={onClose}
            className={styles.productTagList__closeButton}
          />
        )}
      </div>
      {(displayMode === DisplayModeEnum.DESKTOP ||
        renderMode === ProductTagListRenderModeEnum.LIVESTREAM) && (
        <Divider type={DividerType.FULL_WIDTH} className={styles.productTagList__divider} />
      )}
      <div
        className={styles.productTagList__content}
        data-display={displayMode}
        data-layout={layout}
      >
        {sortedProductTags.map((productTag) =>
          productTag.product ? (
            <ProductTag
              renderMode={renderMode}
              layout={layout}
              product={productTag.product}
              isPinned={productTag.product?.productId === pinnedProductId}
              onClick={() => handleClickProductLink?.(productTag)}
              sourceId={sourceId}
              pageId={pageId}
              componentId={componentId}
              sourceType={
                renderMode === ProductTagListRenderModeEnum.LIVESTREAM
                  ? AnalyticsSourceTypeEnum.ROOM
                  : AnalyticsSourceTypeEnum.POST
              }
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
