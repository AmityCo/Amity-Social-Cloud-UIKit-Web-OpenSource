import React, { memo } from 'react';
import useImage from '~/core/hooks/useImage';
import useCategory from '~/social/hooks/useCategory';
import UICategoryCard from './UICategoryCard';

interface CategoryCardProps {
  categoryId: string;
  className?: string;
  loading?: boolean;
  onClick?: (categoryId: string) => void;
}

const CategoryCard = ({ categoryId, className, loading, onClick, ...props }: CategoryCardProps) => {
  const category = useCategory(categoryId);
  const fileUrl = useImage({ fileId: category?.avatarFileId });

  return (
    <UICategoryCard
      avatarFileUrl={fileUrl}
      className={className}
      categoryId={categoryId}
      name={category?.name}
      loading={loading}
      onClick={onClick}
      {...props}
    />
  );
};

export { UICategoryCard };

export default memo(CategoryCard);
