import React from 'react';

import StyledImage from './StyledImage';

interface LocalImageProps {
  className?: string;
  'data-qa-anchor'?: string;
  file?: File;
  progress?: number;
  mediaFit?: 'cover' | 'contain';
  noBorder?: boolean;
  isRejected?: boolean;
  retry?: () => void;
  overlayElements?: React.ReactNode;
  onRemove?: () => void;
}

const LocalImage = ({
  className,
  'data-qa-anchor': dataQaAnchor = '',
  file,
  progress = -1,
  mediaFit,
  noBorder,
  onRemove,
  isRejected,
  retry = () => {},
  overlayElements,
}: LocalImageProps) => {
  if (file == null) return null;

  const fileUrl = URL.createObjectURL(file);

  return (
    <StyledImage
      className={className}
      data-qa-anchor={dataQaAnchor}
      url={fileUrl}
      progress={progress}
      mediaFit={mediaFit}
      noBorder={noBorder}
      isRejected={isRejected}
      overlayElements={overlayElements}
      onRemove={onRemove}
      onRetry={() => retry()}
    />
  );
};

export default LocalImage;
