import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductTagSelection } from '~/v4/social/features/product-tagged/components/ProductTagSelection';
import { ProductTagSelectionMode } from '~/v4/social/features/product-tagged/components/ProductTagSelection/ProductTagSelection';
import { RenderModeEnum } from '~/v4/social/features/product-tagged/elements/ManageProductTag/ManageProductTag';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

// Helper function to check if product tags have changed
const hasProductTagsChanged = (
  initial: Amity.ProductTag[],
  current: Amity.ProductTag[],
): boolean => {
  if (initial.length !== current.length) return true;

  const initialIds = new Set(initial.map((tag) => tag.productId));
  const currentIds = new Set(current.map((tag) => tag.productId));

  if (initialIds.size !== currentIds.size) return true;

  for (const id of currentIds) {
    if (!initialIds.has(id)) return true;
  }

  return false;
};

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
  remainingLimit?: number;
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
  remainingLimit,
}: ProductTagSelectionWrapperProps) {
  const { confirm } = useConfirmContext();

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

  const handleClose = useCallback(
    (selectedProducts: Amity.ProductTag[], hasChanges?: boolean) => {
      // For livestream mode: compare mergedTags with selectedProducts (localSelectedProduct)
      // For non-livestream mode: use hasChanges passed from ProductTagSelection
      const hasUnsavedChanges =
        mode === 'livestream'
          ? hasProductTagsChanged(mergedTags, selectedProducts)
          : hasChanges ?? false;

      if (hasUnsavedChanges) {
        confirm({
          type: 'confirm',
          title: 'Discard product tags',
          content:
            "You have tagged products that haven't been saved yet. If you leave now, your changes will be lost.",
          okText: 'Discard',
          cancelText: 'Keep editing',
          okButtonColor: 'alert',
          onOk: () => {
            onClose(mergedTags, false);
          },
        });
      } else {
        onClose(selectedProducts, false);
      }
    },
    [confirm, mergedTags, onClose, mode],
  );

  return (
    <ProductTagSelection
      renderMode={renderMode}
      selectedProductTags={currentProductTags}
      pageId={pageId}
      displayMode={displayMode}
      mode={mode}
      onClose={(selectedProducts, hasChanges) =>
        handleClose(selectedProducts ?? currentProductTags, hasChanges)
      }
      onDone={handleDone}
      onTagChanges={(tags) => {
        setCurrentProductTags(tags);
        onProductTagsChange?.(tags);
      }}
      onUpdateProductTags={onUpdateProductTags}
      onRemoveProduct={onRemoveProduct}
      maxCount={maxCount}
      remainingLimit={remainingLimit}
      pinnedProductId={pinnedProductId}
      onPinnedProductIdChange={onPinnedProductIdChange}
      isFromManageTagList={isFromManageTagList}
      isShowSearch={isShowSearchProduct}
      isHost={isHost}
    />
  );
}
