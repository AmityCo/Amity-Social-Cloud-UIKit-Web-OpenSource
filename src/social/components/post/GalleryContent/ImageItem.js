import React from 'react';
import Image from '~/core/components/Uploaders/Image';

export const Thumbnail = ({ item }) => {
  return (
    <Image
      fileId={item.data.fileId}
      data-qa-anchor="post-gallery-content-image-thumbnail-item"
      mediaFit="cover"
    />
  );
};

export const Item = ({ item }) => {
  return (
    <Image
      fileId={item.data.fileId}
      data-qa-anchor="post-gallery-content-image-item"
      mediaFit="contain"
      noBorder
    />
  );
};
