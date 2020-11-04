import React from 'react';
import PropTypes from 'prop-types';

import useCategory from '~/social/hooks/useCategory';

import UICategoryHeader from './styles';

const CategoryHeader = ({ className, categoryId, children, onClick }) => {
  const { category, file } = useCategory(categoryId);

  return (
    <UICategoryHeader
      className={className}
      categoryId={category.categoryId}
      name={category.name}
      avatarFileUrl={file.fileUrl}
      onClick={onClick}
    >
      {children}
    </UICategoryHeader>
  );
};

CategoryHeader.propTypes = {
  className: PropTypes.string,
  categoryId: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

CategoryHeader.defaultProps = {
  children: null,
};

export default CategoryHeader;
