import React, { useCallback, useState } from 'react';

import ProgressBar from '~/core/components/ProgressBar';
import {
  ButtonContainer,
  Content,
  ImageContainer,
  ImageSkeleton,
  ImgPreview,
  RemoveButton,
  RetryButton,
} from './styles';

export interface StyledImageProps {
  className?: string;
  'data-qa-anchor'?: string;
  url?: string;
  progress?: number;
  mediaFit?: 'cover' | 'contain';
  noBorder?: boolean;
  isRejected?: boolean;
  overlayElements?: React.ReactNode;
  onRemove?: () => void;
  onRetry?: () => void;
}

const StyledImage = ({
  className,
  'data-qa-anchor': dataQaAnchor = '',
  url,
  progress,
  mediaFit,
  noBorder,
  onRemove,
  isRejected,
  onRetry,
  overlayElements,
}: StyledImageProps) => {
  const [uploadFailed, setUploadFailed] = useState(false);

  const removeCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove && onRemove();
    },
    [onRemove],
  );

  const retryCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRetry && onRetry();
    },
    [onRetry],
  );

  return (
    <ImageContainer className={className} border={!noBorder} data-qa-anchor={dataQaAnchor}>
      <Content>
        {url ? (
          <ImgPreview
            src={url}
            mediaFit={mediaFit}
            className={isRejected ? 'darken' : undefined}
            onError={() => setUploadFailed(true)}
          />
        ) : (
          <ImageSkeleton />
        )}

        <ButtonContainer>
          {(!!isRejected || uploadFailed) && <RetryButton onClick={retryCallback} />}

          {!!onRemove && <RemoveButton onClick={removeCallback} />}

          {overlayElements}
        </ButtonContainer>
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={(progress || 0) * 100} />}
    </ImageContainer>
  );
};

export default StyledImage;
