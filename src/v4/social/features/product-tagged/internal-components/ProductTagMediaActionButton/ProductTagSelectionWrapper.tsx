import { useState, useEffect, useMemo } from 'react';
import { ProductTagSelection } from '~/v4/social/features/product-tagged/components/ProductTagSelection';
import { ProductTagSelectionMode } from '~/v4/social/features/product-tagged/components/ProductTagSelection/ProductTagSelection';
import { RenderModeEnum } from '~/v4/social/features/product-tagged/elements/ManageProductTag/ManageProductTag';

interface ProductTagSelectionWrapperProps {
  initialProductTags: Amity.ProductTag[];
  alreadyTaggedProducts?: Amity.ProductTag[];
  onProductTagsChange?: (tags: Amity.ProductTag[]) => void;
  onUpdateProductTags?: (tags: Amity.ProductTag[]) => void;
  onRemoveProduct?: (productTag: Amity.ProductTag) => void;
  pageId?: string;
  displayMode: 'desktop' | 'mobile';
  onClose: (currentTags: Amity.ProductTag[], hasLocalChanges?: boolean) => void;
  onDone?: (tags: Amity.ProductTag[]) => void;
  maxCount?: number;
  mode?: ProductTagSelectionMode;
  pinnedProductId?: string;
  onPinnedProductIdChange?: (pinnedProductId: string | undefined) => void;
  renderMode?: RenderModeEnum;
  isFromManageTagList?: boolean;
  isShowSearchProduct?: boolean;
  isHost?: boolean;
}

export function ProductTagSelectionWrapper({
  initialProductTags,
  alreadyTaggedProducts,
  onProductTagsChange,
  onUpdateProductTags,
  onRemoveProduct,
  pageId,
  displayMode,
  onClose,
  onDone,
  maxCount,
  mode,
  pinnedProductId,
  onPinnedProductIdChange,
  renderMode,
  isFromManageTagList,
  isShowSearchProduct = false,
  isHost = false,
}: ProductTagSelectionWrapperProps) {
  // Merge and deduplicate initialProductTags with alreadyTaggedProducts
  const mergedTags = useMemo(
    () =>
      isFromManageTagList && alreadyTaggedProducts
        ? (() => {
            const tagMap = new Map<string, Amity.ProductTag>();
            [...initialProductTags, ...alreadyTaggedProducts].forEach((tag) => {
              tagMap.set(tag.productId, tag);
            });
            return Array.from(tagMap.values());
          })()
        : initialProductTags,
    [initialProductTags, alreadyTaggedProducts, isFromManageTagList],
  );

  const [currentProductTags, setCurrentProductTags] = useState<Amity.ProductTag[]>(mergedTags);

  // Sync state when mergedTags changes (e.g., when initialProductTags or alreadyTaggedProducts update)
  useEffect(() => {
    setCurrentProductTags(mergedTags);
  }, [mergedTags]);

  const handleDone = () => {
    onDone?.(currentProductTags);
  };

  return (
    <ProductTagSelection
      renderMode={renderMode}
      selectedProductTags={currentProductTags}
      pageId={pageId}
      displayMode={displayMode}
      mode={mode}
      onClose={(selectedProducts) => onClose(selectedProducts ?? currentProductTags)}
      onDone={handleDone}
      onTagChanges={(tags) => {
        setCurrentProductTags(tags);
        onProductTagsChange?.(tags);
      }}
      onUpdateProductTags={onUpdateProductTags}
      onRemoveProduct={onRemoveProduct}
      maxCount={maxCount}
      pinnedProductId={pinnedProductId}
      onPinnedProductIdChange={onPinnedProductIdChange}
      isFromManageTagList={isFromManageTagList}
      isShowSearch={isShowSearchProduct}
      isHost={isHost}
    />
  );
}
