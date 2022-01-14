import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FileRepository, ImageSize } from '@amityco/js-sdk';
import UICategoryCard from './UICategoryCard';
import useCategory from '~/social/hooks/useCategory';

const CategoryCard = ({ categoryId, className, loading, onClick, ...props }) => {
  const { category } = useCategory(categoryId);

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      category.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: category.avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [category.avatarFileId],
  );

  return (
    <UICategoryCard
      avatarFileUrl={fileUrl}
      className={className}
      categoryId={category.categoryId}
      name={category.name}
      loading={loading}
      onClick={onClick}
      {...props}
    />
  );
};

CategoryCard.propTypes = {
  categoryId: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(CategoryCard);
