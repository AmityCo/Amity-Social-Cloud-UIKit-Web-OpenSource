import { useState } from 'react';
import { ProductTagSelection } from '~/v4/social/features/product-tagged/components/ProductTagSelection';

interface ProductTagSelectionWrapperProps {
  initialProductTags: Amity.ProductTag[];
  pageId?: string;
  displayMode: 'desktop' | 'mobile';
  onClose: () => void;
  onDone: (tags: Amity.ProductTag[]) => void;
}

export function ProductTagSelectionWrapper({
  initialProductTags,
  pageId,
  displayMode,
  onClose,
  onDone,
}: ProductTagSelectionWrapperProps) {
  const [currentProductTags, setCurrentProductTags] =
    useState<Amity.ProductTag[]>(initialProductTags);

  const handleDone = () => {
    onDone(currentProductTags);
  };

  return (
    <ProductTagSelection
      selectedProductTags={currentProductTags}
      pageId={pageId}
      displayMode={displayMode}
      onClose={onClose}
      onDone={handleDone}
      onTagChanges={setCurrentProductTags}
    />
  );
}
