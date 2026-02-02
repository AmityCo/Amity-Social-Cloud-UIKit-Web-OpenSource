import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import {
  ProductTagSelectionHeader,
  ProductTagEmpty,
  ProductTagNoResult,
  ProductTagSelectedItem,
  ProductTagSelectionItem,
  ProductTagSelectionSearchBar,
} from '~/v4/social/features/product-tagged/elements';
import { useSearchProducts } from '~/v4/social/features/product-tagged/hooks';
import styles from './ProductTagSelection.module.css';
import { Divider, DividerType } from '~/v4/social/elements/Divider';
import { Typography } from '~/v4/core/components';
import { ProductSelectionItemSkeleton } from '~/v4/social/features/product-tagged/internal-components';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { DisplayModeEnum, DisplayMode } from '~/v4/social/types';
import { SubmitButton } from '~/v4/social/internal-components/SubmitButton';

type ProductTagSelectionMode = 'create' | 'edit';

export interface ProductTagSelectionProps {
  selectedProductTags: Amity.ProductTag[];
  onTagChanges: (tags: Amity.ProductTag[]) => void;
  displayMode?: DisplayMode;
  mode?: ProductTagSelectionMode;
  onDone?: () => void;
  onClose?: () => void;
  pageId?: string;
  maxCount?: number;
}

const DEBOUNCE_DELAY = 300;
const MAX_PRODUCTS = 5;

export function ProductTagSelection({
  selectedProductTags,
  onTagChanges,
  displayMode = DisplayModeEnum.MOBILE,
  mode = 'create',
  onDone,
  onClose,
  pageId = PAGE_ID.WILD_CARD,
}: ProductTagSelectionProps) {
  const componentId = COMPONENT_ID.PRODUCT_TAG_SELECTION;
  const { themeStyles, accessibilityId, config, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform product search
  const hasSearchQuery = debouncedQuery.trim() !== '';

  const {
    items: products,
    hasMore,
    loadMore,
    isLoading,
  } = useSearchProducts({
    keyword: debouncedQuery,
    isActive: true,
    isDeleted: false,
    limit: 10,
    shouldCall: hasSearchQuery,
    minKeywordLength: 3,
  });

  // Create lookup map for selected products
  const selectedProductIds = useMemo(
    () => new Set(selectedProductTags.map((tag) => tag.productId)),
    [selectedProductTags],
  );

  const handleProductToggle = useCallback(
    (product: Amity.Product, isSelected: boolean) => {
      if (isSelected) {
        // Add product tag
        const newTag: Amity.ProductTag = {
          productId: product.productId,
          product,
        };
        onTagChanges([...selectedProductTags, newTag]);
      } else {
        // Remove product tag
        onTagChanges(selectedProductTags.filter((tag) => tag.productId !== product.productId));
      }
    },
    [selectedProductTags, onTagChanges],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const removeProductTag = useCallback(
    (productTag: Amity.ProductTag) => {
      onTagChanges(selectedProductTags.filter((tag) => tag.productId !== productTag.productId));
    },
    [selectedProductTags, onTagChanges],
  );

  if (isExcluded) return null;

  const showEmpty = debouncedQuery.length < 3;
  const showNoResult = debouncedQuery.length > 2 && products.length === 0 && !isLoading;

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      hasMore && !isLoading && loadMore();
    },
  });

  return (
    <div
      className={styles.productTagSelection}
      style={themeStyles}
      data-test-id={accessibilityId}
      data-display={displayMode}
    >
      <ProductTagSelectionHeader
        mode={mode}
        displayMode={displayMode}
        selectedCount={selectedProductTags.length}
        maxCount={MAX_PRODUCTS}
        onClose={onClose}
        onDone={onDone}
        pageId={pageId}
        componentId={componentId}
      />
      <Divider type={DividerType.FULL_WIDTH} />
      {selectedProductTags.length > 0 && (
        <>
          <Typography.BodyBold className={styles.productTagSelection__selectedProduct__title}>
            Tagged products
          </Typography.BodyBold>
          <div className={styles.productTagSelection__selectedProduct}>
            {selectedProductTags.map((productTag) => {
              return (
                <ProductTagSelectedItem
                  productTag={productTag}
                  onClick={(productTag) => removeProductTag(productTag)}
                  key={productTag.productId}
                />
              );
            })}
          </div>
          <Divider type={DividerType.FULL_WIDTH} />
        </>
      )}

      <div className={styles.productTagSelection__content}>
        <ProductTagSelectionSearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          pageId={pageId}
          componentId={componentId}
        />

        <div className={styles.productTagSelection__results}>
          {showEmpty ? (
            <ProductTagEmpty pageId={pageId} componentId={componentId} />
          ) : showNoResult ? (
            <ProductTagNoResult pageId={pageId} componentId={componentId} />
          ) : (
            <div
              className={styles.productTagSelection__list}
              role="group"
              aria-label="Product selection list"
            >
              {products.map((product) => {
                const isSelected = selectedProductIds.has(product.productId);
                const isDisabled = !isSelected && selectedProductTags.length >= MAX_PRODUCTS;

                return (
                  <ProductTagSelectionItem
                    key={product.productId}
                    product={product}
                    isSelected={isSelected}
                    onChange={(selected) => handleProductToggle(product, selected)}
                    pageId={pageId}
                    componentId={componentId}
                    isDisabled={isDisabled}
                  />
                );
              })}
              <div
                ref={(node) => setIntersectionNode(node)}
                className={styles.productTagSelection__intersectionObserver}
                aria-hidden="true"
              />
            </div>
          )}

          {isLoading && (
            <div className={styles.productTagSelection__loading}>
              {Array.from({ length: 3 }).map((_, index) => (
                <ProductSelectionItemSkeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
      {displayMode === 'desktop' && (
        <div className={styles.productTagSelection__submitButton}>
          <SubmitButton
            textButton={'Done'}
            isDisabled={selectedProductTags.length === 0}
            onPress={onDone}
          />
        </div>
      )}
    </div>
  );
}
