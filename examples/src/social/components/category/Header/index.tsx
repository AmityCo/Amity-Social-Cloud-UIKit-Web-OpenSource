import React, { ReactNode } from 'react';

import useCategory from '~/social/hooks/useCategory';

import UICategoryHeader from './UICategoryHeader';
import useImage from '~/core/hooks/useImage';

type CategoryHeaderProps = {
  className?: string;
  categoryId: string;
  children?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
};

const CategoryHeader = ({
  className,
  categoryId,
  children,
  loading,
  onClick,
}: CategoryHeaderProps) => {
  const category = useCategory(categoryId);

  const avatarFileUrl = useImage({ fileId: category?.avatarFileId, imageSize: 'small' });

  return (
    <UICategoryHeader
      className={className}
      categoryId={category?.categoryId}
      name={category?.name}
      avatarFileUrl={avatarFileUrl}
      loading={loading || false}
      onClick={onClick}
    >
      {children}
    </UICategoryHeader>
  );
};

export default CategoryHeader;
