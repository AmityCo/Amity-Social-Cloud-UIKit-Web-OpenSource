import React from 'react';
import Image from '~/core/components/Uploaders/Image';

interface ThumbnailProps {
  item?: Amity.Post<'image'>;
}

export const Thumbnail = ({ item }: ThumbnailProps) => {
  return (
    <Image
      key={item?.data?.fileId}
      fileId={item?.data?.fileId}
      data-testid="post-gallery-content-image-thumbnail-item"
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
      fileId={item?.data?.fileId}
      data-testid="post-gallery-content-image-item"
      mediaFit="contain"
      noBorder
    />
  );
};
