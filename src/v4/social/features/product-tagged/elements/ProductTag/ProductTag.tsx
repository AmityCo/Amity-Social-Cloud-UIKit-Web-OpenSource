import React, { useRef, useEffect, useState } from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import styles from './ProductTag.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ProductImageThumbnail } from '~/v4/social/features/product-tagged/internal-components/ProductImageThumbnail/ProductImageThumbnail';
import { formatPrice } from '~/v4/social/utils/formatPrice';
import { Button } from '~/v4/core/components/AriaButton';
import {
  ProductTagListRenderMode,
  ProductTagListRenderModeEnum,
  LayoutVariant,
  LayoutVariantEnum,
} from '~/v4/social/types';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { useTheme } from '~/v4/core/providers/ThemeProvider';

export interface ProductTagProps {
  product: Amity.Product;
  pageId?: string;
  componentId?: string;
  renderMode?: ProductTagListRenderMode;
  layout?: LayoutVariant;
  isPinned?: boolean;
  sourceId?: string;
  sourceType?: Amity.AnalyticsSourceType;
  onClick?: () => void;
  isShowView?: boolean;
  shouldTrackAnalytics?: boolean;
}

export function ProductTag({
  product,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  renderMode = ProductTagListRenderModeEnum.POST,
  layout = LayoutVariantEnum.LIST,
  isPinned = false,
  sourceId,
  sourceType,
  onClick,
  isShowView: showViewButton = true,
  shouldTrackAnalytics = true,
}: ProductTagProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG;
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const [hasMarkedAsViewed, setHasMarkedAsViewed] = useState(false);
  const { isVisible } = useVisibilitySensor({ threshold: 0.6, elementRef });
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (
      isVisible &&
      !hasMarkedAsViewed &&
      shouldTrackAnalytics &&
      product?.analytics &&
      sourceType &&
      sourceId
    ) {
      if (accessibilityId.includes('pending_posts_page')) return;
      product.analytics.markAsViewed(accessibilityId, sourceType, sourceId);
      setHasMarkedAsViewed(true);
    }
  }, [
    isVisible,
    hasMarkedAsViewed,
    shouldTrackAnalytics,
    product,
    accessibilityId,
    sourceType,
    sourceId,
  ]);

  // Card layout is not supported in livestream mode, fallback to list
  const effectiveLayout =
    layout === LayoutVariantEnum.CARD && renderMode === ProductTagListRenderModeEnum.LIVESTREAM
      ? LayoutVariantEnum.LIST
      : layout;

  const isLivestream = renderMode === ProductTagListRenderModeEnum.LIVESTREAM;

  const unavailable = product.status === 'archived';

  const imageUrl = product.thumbnailUrl;
  const price = formatPrice(product.price, product.currency);

  const handlePress = () => {
    if (unavailable) return;

    if (
      shouldTrackAnalytics &&
      sourceType &&
      sourceId &&
      !accessibilityId.includes('pending_posts_page')
    ) {
      product?.analytics.markAsClicked(accessibilityId, sourceType, sourceId);
    }
    onClick?.();
  };

  return (
    <div
      ref={elementRef}
      role="button"
      tabIndex={0}
      className={styles.productTag}
      style={themeStyles}
      data-test-id={accessibilityId}
      data-mode={renderMode}
      data-layout={effectiveLayout}
      data-unavailable={unavailable}
      onClick={handlePress}
    >
      <ProductImageThumbnail
        imageUrl={imageUrl}
        thumbnailMode={product.thumbnailMode}
        alt={product.productName || product.productId}
        size="large"
        isPinned={isPinned}
        unavailable={unavailable}
      />
      <div
        className={styles.productTag__information}
        data-mode={renderMode}
        data-layout={effectiveLayout}
      >
        <div
          className={styles.productTag__content}
          data-mode={renderMode}
          data-layout={effectiveLayout}
          data-unavailable={unavailable}
        >
          <div className={styles.productTag__textContent}>
            {unavailable && (
              <Typography.Caption
                as="p"
                className={styles.productTag__unavailableLabel}
                data-theme={currentTheme}
              >
                {useString('amity_social_button_tagged_products_archived_info')}
              </Typography.Caption>
            )}
            <Typography.BodyBold
              as="p"
              className={styles.productTag__title}
              data-unavailable={unavailable}
            >
              {product.productName || product.productId}
            </Typography.BodyBold>
          </div>
          {((price && !unavailable) || (showViewButton && isLivestream)) && (
            <div className={styles.productTag__priceRow}>
              {!unavailable && price && (
                <Typography.Caption as="p" className={styles.productTag__price}>
                  {price}
                </Typography.Caption>
              )}
              {showViewButton && isLivestream && (
                <Button
                  onPress={handlePress}
                  variant="fill"
                  color="primary"
                  className={styles.productTag__viewButton}
                >
                  <Typography.CaptionBold as="span">
                    {useString('amity_social_button_view')}
                  </Typography.CaptionBold>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
