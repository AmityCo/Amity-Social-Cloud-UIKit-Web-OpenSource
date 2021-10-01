import React from 'react';
import Image from '~/core/components/Uploaders/Image';

export function Thumbnail({ item }) {
  return <Image fileId={item.data.fileId} mediaFit="cover" />;
}

export function Item({ item }) {
  return <Image fileId={item.data.fileId} mediaFit="contain" noBorder />;
}
