import React from 'react';

import StyledVideo, { StyledVideoProps } from './StyledVideo';

type LocalVideoProps = { file?: File } & StyledVideoProps;

const LocalVideo = ({ file, ...props }: LocalVideoProps) => {
  if (file == null) return null;

  const fileUrl = URL.createObjectURL(file);

  return <StyledVideo url={fileUrl} {...props} />;
};

export default LocalVideo;
