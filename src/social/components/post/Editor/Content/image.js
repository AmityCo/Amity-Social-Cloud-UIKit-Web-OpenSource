import React from 'react';
import PropTypes from 'prop-types';
import GalleryGrid from '~/core/components/GalleryGrid';
import Image from '~/core/components/Uploaders/Image';

const ImageContentList = ({ items, onRemove }) => {
  return (
    <GalleryGrid items={items}>
      {(post) => <Image fileId={post?.data?.fileId} onRemove={() => onRemove(post.postId)} />}
    </GalleryGrid>
  );
};

ImageContentList.propTypes = {
  items: PropTypes.array,
  onRemove: PropTypes.func,
};

ImageContentList.defaultProps = {
  items: [],
  onRemove: () => {},
};

export default ImageContentList;
