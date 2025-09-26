import React from 'react';

import useFile from '~/core/hooks/useFile';

import StyledImage from './StyledImage';
import useImage from '~/core/hooks/useImage';

interface DistantImageProps {
  className?: string;
  'data-testid'?: string;
  fileId?: string;
  loading?: boolean;
  mediaFit?: 'cover' | 'contain';
  noBorder?: boolean;
  overlayElements?: React.ReactNode;
  onRemove?: () => void;
}

const DistantImage = ({
  className,
  'data-testid': dataQaAnchor = '',
  fileId,
  loading = false,
  mediaFit = 'cover',
  noBorder,
  onRemove,
  overlayElements = undefined,
}: DistantImageProps) => {
  const imageUrl = useImage({ fileId });

  if (loading || imageUrl == null) return null;

  return (
    <StyledImage
      className={className}
      data-testid={dataQaAnchor}
      url={imageUrl}
      mediaFit={mediaFit}
      noBorder={noBorder}
      overlayElements={overlayElements}
      onRemove={onRemove}
    />
  );
};

export default DistantImage;
