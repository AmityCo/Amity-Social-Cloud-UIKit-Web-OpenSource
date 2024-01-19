import React from 'react';
import GalleryGrid from '~/core/components/GalleryGrid';
import Image from '~/core/components/Uploaders/Image';

interface ImageContentListProps {
  items: Amity.Post[];
  onRemove: (id: string) => void;
}

const ImageContentList = ({ items, onRemove }: ImageContentListProps) => {
  return (
    <GalleryGrid
      items={items}
      renderItem={(post) => (
        <Image fileId={post?.data?.fileId} onRemove={() => onRemove(post.postId)} />
      )}
    />
  );
};

export default ImageContentList;
