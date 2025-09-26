import React from 'react';
import LocalVideo from './LocalVideo';
import DistantVideo from './DistantVideo';
import { StyledVideoProps } from './StyledVideo';

type VideoProps = { file?: File; fileId?: string } & StyledVideoProps;

export default function Video(props: VideoProps) {
  if ('fileId' in props) return <DistantVideo {...props} />;
  if ('file' in props) return <LocalVideo {...props} />;
  return null;
}
