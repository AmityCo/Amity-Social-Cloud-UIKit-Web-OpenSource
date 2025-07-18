import React from 'react';
import LocalImage from './LocalImage';
import DistantImage from './DistantImage';
import { StyledImageProps } from './StyledImage';

type ImageProps = { file?: File; fileId?: string; fileUrl?: string } & StyledImageProps;

export default function Image(props: ImageProps) {
  if ('fileId' in props && !!props.fileId) return <DistantImage {...props} />;
  if ('file' in props || !!props.fileUrl) return <LocalImage {...props} />;
  return null;
}
