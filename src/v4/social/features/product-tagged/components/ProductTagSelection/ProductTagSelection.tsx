import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import {
  ProductTagSelectionHeader,
  ProductTagEmpty,
  ProductTagNoResult,
  ProductTagSelectedItem,
  ProductTagSelectionItem,
  ProductTagSelectionSearchBar,
  ProductTagNoTagsYet,
} from '~/v4/social/features/product-tagged/elements';
import { useSearchProducts } from '~/v4/social/features/product-tagged/hooks';
import styles from './ProductTagSelection.module.css';
import { Divider, DividerType } from '~/v4/social/elements/Divider';
import { Typography } from '~/v4/core/components';
import { ProductSelectionItemSkeleton } from '~/v4/social/features/product-tagged/internal-components';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { DisplayModeEnum, DisplayMode } from '~/v4/social/types';
import { SubmitButton } from '~/v4/social/internal-components/SubmitButton/';
import ChevronRight from '~/v4/icons/ChevronRight';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { Button } from '~/v4/core/components/AriaButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ManageProductTagList } from '~/v4/social/features/product-tagged/components/ManageProductTagList';
import { RenderModeEnum } from '~/v4/social/features/product-tagged/elements/ManageProductTag/ManageProductTag';

export type ProductTagSelectionMode = 'create' | 'edit' | 'livestream';

export interface ProductTagSelectionProps {
  selectedProductTags?: Amity.ProductTag[];
  onTagChanges: (tags: Amity.ProductTag[]) => void;
  onUpdateProductTags?: (tags: Amity.ProductTag[]) => void;
  displayMode?: DisplayMode;
  mode?: ProductTagSelectionMode;
  onDone?: () => void;
  onClose?: (selectedProducts?: Amity.ProductTag[]) => void;
  pageId?: string;
  maxCount?: number;
  isFromManageTagList?: boolean;
  pinnedProductId?: string;
  onPinnedProductIdChange?: (pinnedProductId: string | undefined) => void;
  renderMode?: RenderModeEnum;
  isShowSearch?: boolean; // Only used for livestream mode to determine whether to show search or the "No products tagged yet" screen
  isHost?: boolean;
  onRemoveProduct?: (productTag: Amity.ProductTag) => void;
}

const DEBOUNCE_DELAY = 300;
const MAX_PRODUCTS = 5;

export function ProductTagSelection({
  selectedProductTags,
  onTagChanges,
  onUpdateProductTags,
  displayMode = DisplayModeEnum.MOBILE,
  mode = 'create',
  onDone,
  onClose,
  pageId = PAGE_ID.WILD_CARD,
  maxCount,
  isFromManageTagList = false,
  pinnedProductId,
  onPinnedProductIdChange,
  renderMode,
  isShowSearch = false,
  isHost = false,
  onRemoveProduct,
}: ProductTagSelectionProps) {
  const componentId = COMPONENT_ID.PRODUCT_TAG_SELECTION;
  const { themeStyles, accessibilityId, config, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [isShowSearchProduct, setIsShowSearchProduct] = useState(isShowSearch);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [localSelectedProduct, setLocalSelectedProduct] = useState<Amity.ProductTag[]>([]);
  const initialProductTagsRef = useRef<Amity.ProductTag[]>(selectedProductTags || []);

  // Check if product tags have changed from initial state (for post mode only)
  const hasProductTagsChanged = useMemo(() => {
    if (mode === 'livestream') return true; // Don't use this check for livestream

    const initialIds = new Set(initialProductTagsRef.current.map((tag) => tag.productId));
    const currentIds = new Set((selectedProductTags || []).map((tag) => tag.productId));

    // Check if sizes are different
    if (initialIds.size !== currentIds.size) return true;

    // Check if all initial IDs exist in current
    for (const id of initialIds) {
      if (!currentIds.has(id)) return true;
    }

    return false;
  }, [selectedProductTags, mode]);

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
    minKeywordLength: 2,
  });

  // Create lookup map for selected products
  const selectedProductIds = useMemo(
    () =>
      new Set(
        [...(localSelectedProduct || []), ...(selectedProductTags || [])].map(
          (tag) => tag.productId,
        ),
      ),
    [selectedProductTags, localSelectedProduct],
  );

  const handleProductToggle = useCallback(
    (product: Amity.Product, isSelected: boolean) => {
      if (isSelected) {
        // Add product tag
        const newTag: Amity.ProductTag = {
          productId: product.productId,
          product,
        };

        setLocalSelectedProduct([...(localSelectedProduct || []), newTag]);

        // Only update parent immediately if not from ManageTagList and not in livestream mode
        if (!isFromManageTagList && mode !== 'livestream') {
          const allTags = [...(selectedProductTags || []), ...(localSelectedProduct || []), newTag];
          const uniqueTags = Array.from(
            new Map(allTags.map((tag) => [tag.productId, tag])).values(),
          );
          onTagChanges(uniqueTags);
        }
      } else {
        // Remove product tag from local selection
        setLocalSelectedProduct(
          (localSelectedProduct || []).filter((tag) => tag.productId !== product.productId),
        );

        // Only update parent immediately if not from ManageTagList and not in livestream mode
        if (!isFromManageTagList && mode !== 'livestream') {
          const allTags = [...(selectedProductTags || []), ...(localSelectedProduct || [])];
          const uniqueTags = Array.from(
            new Map(allTags.map((tag: Amity.ProductTag) => [tag.productId, tag])).values(),
          ).filter((tag) => tag.productId !== product.productId);
          onTagChanges(uniqueTags);
        }
      }
    },
    [selectedProductTags, onTagChanges, localSelectedProduct, isFromManageTagList, mode],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const removeProductTag = useCallback(
    (productTag: Amity.ProductTag) => {
      // Check if the tag being removed is from selectedProductTags or localSelectedProduct
      const isInOriginalSelection = selectedProductTags?.some(
        (tag) => tag.productId === productTag.productId,
      );
      const isInLocalSelection = localSelectedProduct?.some(
        (tag) => tag.productId === productTag.productId,
      );

      if (isFromManageTagList || mode === 'livestream') {
        // When from ManageTagList or in livestream mode, only remove from local selection
        if (isInLocalSelection) {
          setLocalSelectedProduct(
            localSelectedProduct?.filter((tag) => tag.productId !== productTag.productId),
          );
        }
        // In livestream mode, also remove from selectedProductTags if it exists there
        if (mode === 'livestream' && isInOriginalSelection) {
          onTagChanges(
            selectedProductTags?.filter((tag) => tag.productId !== productTag.productId) || [],
          );
        }
      } else {
        // Normal behavior - update parent state immediately
        onTagChanges(
          selectedProductTags?.filter((tag) => tag.productId !== productTag.productId) || [],
        );
        setLocalSelectedProduct(
          localSelectedProduct?.filter((tag) => tag.productId !== productTag.productId),
        );
      }
    },
    [selectedProductTags, onTagChanges, localSelectedProduct, isFromManageTagList, mode],
  );

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Adjust this value based on item width
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (localSelectedProduct.length === 0) return;

    // Merge and deduplicate selectedProductTags and localSelectedProduct
    const allTags = [...(selectedProductTags || []), ...localSelectedProduct];
    const mergedTags = Array.from(new Map(allTags.map((tag) => [tag.productId, tag])).values());

    onTagChanges(mergedTags);

    if (onUpdateProductTags) {
      await onUpdateProductTags(mergedTags);
    }

    setLocalSelectedProduct([]);
    setSearchQuery('');

    const manageProductTagListContent = (close: () => void) => (
      <ManageProductTagList
        renderMode={renderMode}
        productTags={mergedTags}
        pageId={pageId}
        pinnedProductId={pinnedProductId}
        onUpdateProductTags={onUpdateProductTags}
        onProductTagsChange={(updatedTags) => {
          onTagChanges(updatedTags);
        }}
        onPinnedProductIdChange={onPinnedProductIdChange}
        onClose={(updatedTags, updatedPinnedId) => {
          onTagChanges(updatedTags);
          if (onPinnedProductIdChange) {
            onPinnedProductIdChange(updatedPinnedId);
          }

          if (!isDesktop && onUpdateProductTags) {
            onUpdateProductTags(updatedTags);
          }
          setLocalSelectedProduct([]);
          closePopup();
        }}
        isHost={isHost}
        sourceId=""
      />
    );

    if (isDesktop) {
      openPopup({
        id: 'tagged-product-popup',
        pageId,
        componentId: COMPONENT_ID.PRODUCT_TAG_SELECTION,
        isDismissable: true,
        view: 'desktop',
        children: ({ close }) => manageProductTagListContent(close),
      });
    } else {
      setDrawerData({
        content: manageProductTagListContent(() => removeDrawerData()),
        ariaLabel: 'Tagged products',
      });
    }
  }, [
    selectedProductTags,
    localSelectedProduct,
    pinnedProductId,
    openPopup,
    pageId,
    isDesktop,
    onTagChanges,
    onUpdateProductTags,
    onPinnedProductIdChange,
    setDrawerData,
    removeDrawerData,
    renderMode,
    isHost,
    onRemoveProduct,
  ]);

  if (isExcluded) return null;

  const showEmpty = debouncedQuery.length < 2;
  const showNoResult = debouncedQuery.length > 1 && products.length === 0 && !isLoading;

  const isShowNoProductsTagYet =
    mode === 'livestream' &&
    products.length === 0 &&
    !isLoading &&
    selectedProductTags?.length === 0 &&
    !isShowSearchProduct;

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      hasMore && !isLoading && loadMore();
    },
  });

  const selectedProductTagsToShow =
    mode === 'livestream'
      ? isFromManageTagList
        ? localSelectedProduct
        : localSelectedProduct.length === 0
          ? selectedProductTags || []
          : localSelectedProduct
      : selectedProductTags;

  // Check scroll position when selected products change
  useEffect(() => {
    if (isDesktop && selectedProductTagsToShow && selectedProductTagsToShow?.length > 5) {
      checkScrollPosition();
    }
  }, [isDesktop, selectedProductTagsToShow, checkScrollPosition]);

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
        selectedCount={selectedProductTagsToShow?.length}
        maxCount={
          mode === 'livestream'
            ? isFromManageTagList && maxCount
              ? maxCount - (selectedProductTags?.length || 0)
              : maxCount
            : MAX_PRODUCTS
        }
        onClose={() => onClose?.(localSelectedProduct)}
        onDone={onDone}
        pageId={pageId}
        componentId={componentId}
        isShowNoProductsTagYet={isShowNoProductsTagYet}
      />
      <Divider type={DividerType.FULL_WIDTH} />
      {selectedProductTagsToShow && selectedProductTagsToShow?.length > 0 && (
        <>
          <Typography.BodyBold className={styles.productTagSelection__selectedProduct__title}>
            Tagged products
          </Typography.BodyBold>
          <div className={styles.productTagSelection__selectedProductWrapper}>
            {selectedProductTagsToShow?.length > 5 && showLeftArrow && (
              <Button
                variant="default"
                className={`${styles.productTagSelection__scrollArrow} ${styles.productTagSelection__scrollArrow__left}`}
                onPress={() => handleScroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className={styles.productTagSelection__scrollArrow__icon} />
              </Button>
            )}
            <div
              ref={scrollContainerRef}
              className={styles.productTagSelection__selectedProduct}
              onScroll={checkScrollPosition}
            >
              {selectedProductTagsToShow?.map((productTag) => {
                return (
                  <ProductTagSelectedItem
                    productTag={productTag}
                    onClick={(productTag) => removeProductTag(productTag)}
                    key={productTag.productId}
                  />
                );
              })}
            </div>
            {selectedProductTagsToShow.length > 5 && showRightArrow && (
              <Button
                variant="default"
                className={`${styles.productTagSelection__scrollArrow} ${styles.productTagSelection__scrollArrow__right}`}
                onPress={() => handleScroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight className={styles.productTagSelection__scrollArrow__icon} />
              </Button>
            )}
          </div>
          <Divider type={DividerType.FULL_WIDTH} />
        </>
      )}

      <div data-mode={mode} className={styles.productTagSelection__content}>
        {isShowNoProductsTagYet ? (
          <ProductTagNoTagsYet
            pageId={pageId}
            componentId={componentId}
            onPress={() => {
              setIsShowSearchProduct(true);
            }}
          />
        ) : (
          <>
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

                    const isDisabled = (() => {
                      if (isFromManageTagList) {
                        // If product is in original selectedProductTags, disable it (can't modify from here)
                        if (
                          selectedProductTags?.some((tag) => tag.productId === product.productId)
                        ) {
                          return true;
                        }
                        // For new selections, check against maxCount
                        if (!isSelected && maxCount) {
                          return (
                            [...localSelectedProduct, ...(selectedProductTags || [])].length >=
                            maxCount
                          );
                        }
                        return false;
                      }

                      // Normal behavior when not from ManageTagList
                      if (!isSelected && maxCount) {
                        const totalSelected =
                          mode === 'livestream'
                            ? [...localSelectedProduct, ...(selectedProductTags || [])].length
                            : (selectedProductTags || []).length;
                        return totalSelected >= maxCount;
                      }

                      return !isSelected && (selectedProductTags || []).length >= MAX_PRODUCTS;
                    })();

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
          </>
        )}
      </div>

      {!isShowNoProductsTagYet && (
        <div data-mode={mode} className={styles.productTagSelection__submitButton}>
          <SubmitButton
            textButton={mode === 'livestream' ? 'Add products' : 'Done'}
            isDisabled={
              mode === 'livestream' ? localSelectedProduct.length === 0 : !hasProductTagsChanged
            }
            onPress={mode === 'livestream' ? handleSubmit : onDone}
          />
        </div>
      )}
    </div>
  );
}
