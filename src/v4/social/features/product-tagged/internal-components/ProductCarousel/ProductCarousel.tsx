import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { ProductTag } from '~/v4/social/features/product-tagged/elements';
import { ActionButton } from '~/v4/core/components/ActionButton';
import { Typography } from '~/v4/core/components';
import { LayoutVariantEnum } from '~/v4/social/types';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import styles from './ProductCarousel.module.css';
import ChevronRight from '~/v4/icons/ChevronRight';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';

export interface ProductCarouselProps {
  pageId?: string;
  componentId?: string;
  post: Amity.Post;
}

export function ProductCarousel({ pageId = '*', componentId = '*', post }: ProductCarouselProps) {
  const { AmityProducTagtListComponentBehavior } = usePageBehavior();
  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: 'post',
    sourceId: post.postId,
  });
  const { accessibilityId } = useAmityComponent({ pageId, componentId });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Collect unique product tags from post and children posts
  const allProductTags = useMemo(() => {
    const productMap = new Map<string, Amity.ProductTag>();

    if (post.productTags) {
      post.productTags.forEach((tag: Amity.ProductTag) => {
        if (!productMap.has(tag.productId) && !!tag.product) {
          productMap.set(tag.productId, tag);
        }
      });
    }

    if (post.childrenPosts) {
      post.childrenPosts.forEach((childPost) => {
        if (childPost.productTags) {
          childPost.productTags.forEach((tag: Amity.ProductTag) => {
            if (!productMap.has(tag.productId) && !!tag.product) {
              productMap.set(tag.productId, tag);
            }
          });
        }
      });
    }

    return Array.from(productMap.values());
  }, [post.productTags, post.childrenPosts]);

  const visibleProductTags = useMemo(() => allProductTags.slice(0, 5), [allProductTags]);
  const hasMoreProducts = allProductTags.length > 5;

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollThreshold = 10; // Small threshold to account for rounding errors

    setCanScrollLeft(scrollLeft > scrollThreshold);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - scrollThreshold);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition, allProductTags]);

  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  const handleProductTagClick = useCallback(
    (productTag: Amity.ProductTag) => {
      if (AmityProducTagtListComponentBehavior?.onProductTagClick) {
        AmityProducTagtListComponentBehavior.onProductTagClick({ productTag });
      }
    },
    [AmityProducTagtListComponentBehavior, accessibilityId],
  );

  const handleViewAllProducts = useCallback(() => {
    if (allProductTags.length > 0) {
      showProductTagList(allProductTags);
    }
  }, [allProductTags, showProductTagList]);

  if (allProductTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.productCarousel}>
      <Typography.Caption className={styles.productCarousel__headerText}>
        Products tagged
      </Typography.Caption>
      <div className={styles.productCarousel__wrapper}>
        {canScrollLeft && (
          <Button
            className={styles.productCarousel__navButton_left}
            onPress={scrollLeft}
            aria-label="Scroll left"
            variant="default"
          >
            <ChevronLeft className={styles.productCarousel__navButton__icon} />
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className={styles.productCarousel__items}
          onScroll={checkScrollPosition}
        >
          {visibleProductTags.map(
            (productTag) =>
              productTag.product && (
                <ProductTag
                  product={productTag.product}
                  pageId={pageId}
                  componentId={componentId}
                  renderMode="post"
                  layout={LayoutVariantEnum.CARD}
                  isPinned={false}
                  onClick={() => handleProductTagClick(productTag)}
                  sourceId={post.postId}
                  sourceType={AnalyticsSourceTypeEnum.POST}
                />
              ),
          )}
          {hasMoreProducts && (
            <ActionButton
              pageId={pageId}
              componentId={componentId}
              elementId="view_all_products_button"
              size="medium"
              color="secondary"
              onPress={handleViewAllProducts}
              defaultIcon={<ChevronRight />}
            />
          )}
        </div>
        {canScrollRight && (
          <Button
            className={styles.productCarousel__navButton_right}
            onPress={scrollRight}
            aria-label="Scroll right"
            variant="default"
          >
            <ChevronRight className={styles.productCarousel__navButton__icon} />
          </Button>
        )}
      </div>
    </div>
  );
}
