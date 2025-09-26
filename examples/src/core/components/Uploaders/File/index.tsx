import React from 'react';
import LocalFile from './LocalFile';
import DistantFile from './DistantFile';
import { StyledFileProps } from './StyledFile';

type FileProps = { file?: File; fileId?: string } & StyledFileProps;

export default function FileComponent(props: FileProps) {
  if ('fileId' in props) return <DistantFile {...props} />;
  if ('file' in props) return <LocalFile {...props} />;
  return null;
}
