import React from 'react';
import Image from '~/core/components/Uploaders/Image';

export const Thumbnail = ({ item }) => {
  return <Image fileId={item.data.fileId} mediaFit="cover" />;
};

export const Item = ({ item }) => {
  return <Image fileId={item.data.fileId} mediaFit="contain" noBorder />;
};
