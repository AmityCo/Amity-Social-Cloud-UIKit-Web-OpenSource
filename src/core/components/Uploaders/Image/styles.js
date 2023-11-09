import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { SizeMe } from 'react-sizeme';

import Button from '~/core/components/Button';
import ProgressBar from '~/core/components/ProgressBar';
import Skeleton from '~/core/components/Skeleton';

import RemoveIcon from '~/icons/Remove';
import ExclamationCircle from '~/icons/ExclamationCircle';

export const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 2em;
  min-height: 2em;
  width: 100%;
  height: 100%;
  border: ${({ theme, border }) => border && `1px solid ${theme.palette.base.shade4}`};
  border-radius: 4px;
  overflow: hidden;

  .darken {
    opacity: 0.4;
  }
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImgPreviewContainerStyles = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ mediaFit }) => mediaFit ?? 'cover'};
  object-position: center;
`;

export const ImgPreview = styled.img.attrs({ loading: 'lazy' })`
  ${ImgPreviewContainerStyles}
`;

export const SkeletonWrapper = styled.div`
  ${ImgPreviewContainerStyles};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageSkeleton = () => (
  <SizeMe monitorHeight>
    {({ size }) => {
      const minSize = Math.min(size.width, size.height) || 0;

      return (
        <SkeletonWrapper>
          <Skeleton
            borderRadius={0}
            height={minSize}
            width={minSize}
            style={{ display: 'block' }}
          />
        </SkeletonWrapper>
      );
    }}
  </SizeMe>
);

export const RemoveButton = styled(Button).attrs({
  variant: 'secondary',
  children: <RemoveIcon />,
})`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  max-width: 36px;
`;

export const CircleIcon = styled(ExclamationCircle).attrs({ width: 24, height: 24 })`
  z-index: 2;
  opacity: 0.7;
`;

export const RetryButton = styled(Button).attrs({
  variant: 'secondary',
  children: <CircleIcon />,
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

const Image = ({
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
}) => {
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
      <Content remove={!!onRemove}>
        {url ? (
          <ImgPreview
            src={url}
            mediaFit={mediaFit}
            className={!!isRejected && 'darken'}
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

      {!Number.isNaN(progress) && <ProgressBar progress={progress * 100} />}
    </ImageContainer>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  'data-qa-anchor': PropTypes.string,
  url: PropTypes.string,
  progress: PropTypes.number,
  mediaFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  isRejected: PropTypes.bool,
  overlayElements: PropTypes.node,
  onRemove: PropTypes.func,
  onRetry: PropTypes.func,
};

Image.defaultProps = {
  className: undefined,
  'data-qa-anchor': '',
  url: undefined,
  progress: -1,
  onRemove: undefined,
  isRejected: false,
  onRetry: undefined,
  overlayElements: undefined,
};

export default Image;
