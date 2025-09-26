import React from 'react';
import LocalImage from './LocalImage';
import DistantImage from './DistantImage';
import { StyledImageProps } from './StyledImage';

type ImageProps = { file?: File; fileId?: string } & StyledImageProps;

export default function Image(props: ImageProps) {
  if ('fileId' in props) return <DistantImage {...props} />;
  if ('file' in props) return <LocalImage {...props} />;
  return null;
}
