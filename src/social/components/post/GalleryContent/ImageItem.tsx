import React from 'react';
import Image from '~/core/components/Uploaders/Image';

interface ThumbnailProps {
  item?: Amity.Post<'image'>;
}

export const Thumbnail = ({ item }: ThumbnailProps) => {
  return (
    <Image
      fileId={item?.data.fileId}
      data-qa-anchor="post-gallery-content-image-thumbnail-item"
      mediaFit="cover"
    />
  );
};

interface ItemProps {
  item?: Amity.Post<'image'>;
}

export const Item = ({ item }: ItemProps) => {
  return (
    <Image
      fileId={item?.data.fileId}
      data-qa-anchor="post-gallery-content-image-item"
      mediaFit="contain"
      noBorder
    />
  );
};
