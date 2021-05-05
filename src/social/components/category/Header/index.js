import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

import useCategory from '~/social/hooks/useCategory';

import UICategoryHeader from './styles';

const CategoryHeader = ({ className, categoryId, children, onClick }) => {
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
    <UICategoryHeader
      className={className}
      categoryId={category.categoryId}
      name={category.name}
      avatarFileUrl={fileUrl}
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
