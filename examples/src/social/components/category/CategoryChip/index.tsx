import React from 'react';

import UICategoryChip from './UICategoryChip';
import useCategory from '~/social/hooks/useCategory';
import useImage from '~/core/hooks/useImage';

interface CategoryChipProps {
  categoryId: string;
  onClick?: (categoryId: string) => void;
  onRemove?: (categoryId: string) => void;
}

const CategoryChip = ({ categoryId, onClick, onRemove }: CategoryChipProps) => {
  const category = useCategory(categoryId);
  const avatarFileUrl = useImage({ fileId: category?.avatarFileId, imageSize: 'small' });

  if (category == null) return null;

  return (
    <UICategoryChip
      categoryId={category.categoryId}
      name={category.name}
      fileUrl={avatarFileUrl}
      onClick={(categoryId: string) => onClick?.(categoryId)}
      onRemove={onRemove}
    />
  );
};

export default CategoryChip;
