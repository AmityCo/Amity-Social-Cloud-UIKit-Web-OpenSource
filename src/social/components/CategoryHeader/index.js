import React from 'react';
import PropTypes from 'prop-types';

import useCategory from '~/social/hooks/useCategory';

import UICategoryHeader from './styles';

const CategoryHeader = ({ categoryId, children, onClick }) => {
  const { category, file } = useCategory(categoryId);

  return (
    <UICategoryHeader
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
  categoryId: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

CategoryHeader.defaultProps = {
  children: null,
  onClick: () => {},
};

export default CategoryHeader;
