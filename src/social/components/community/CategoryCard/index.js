import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useImage from '~/core/hooks/useImage';
import useCategory from '~/social/hooks/useCategory';
import UICategoryCard from './UICategoryCard';

const CategoryCard = ({ categoryId, className, loading, onClick, ...props }) => {
  const { category } = useCategory(categoryId);
  const fileUrl = useImage({ fileId: category.avatarFileId });

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
