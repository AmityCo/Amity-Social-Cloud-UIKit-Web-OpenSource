import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { SizeMe } from 'react-sizeme';

import Button from '~/core/components/Button';
import ProgressBar from '~/core/components/ProgressBar';
import Skeleton from '~/core/components/Skeleton';

import Play from '~/icons/Play';
import RemoveIcon from '~/icons/Remove';
import ExclamationCircle from '~/icons/ExclamationCircle';

export const VideoContainer = styled.div`
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

const VideoPreviewContainerStyles = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ mediaFit }) => mediaFit ?? 'cover'};
  object-position: center;
`;

export const VideoPreview = styled(({ src, mimeType, mediaFit, ...props }) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video controls controlsList="nodownload" {...props}>
    <source src={src} type={mimeType} />
  </video>
))`
  ${VideoPreviewContainerStyles}
  cursor: pointer;
`;

export const SkeletonWrapper = styled.div`
  ${VideoPreviewContainerStyles};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoSkeleton = () => (
  <SizeMe monitorHeight>
    {({ size }) => {
      const minSize = Math.min(size.width, size.height);

      return (
        <SkeletonWrapper>
          <Skeleton height={minSize} width={minSize} style={{ display: 'block' }} />
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
`;

export const CircleIcon = styled(ExclamationCircle)`
  z-index: 2;
  opacity: 0.7;
  font-size: 24px;
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

const ButtonContainer = styled.div`
  display: flex;
`;

export const PlayIcon = styled(Play)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const Video = ({
  url,
  progress,
  mediaFit,
  noBorder,
  onRemove,
  isRejected,
  onRetry,
  mimeType,
  autoPlay,
}) => {
  function removeCallback(e) {
    e.preventDefault();
    e.stopPropagation();
    onRemove && onRemove();
  }

  function retryCallback(e) {
    e.preventDefault();
    e.stopPropagation();
    onRetry && onRetry();
  }

  return (
    <VideoContainer border={!noBorder}>
      <Content remove={!!onRemove}>
        {url ? (
          <VideoPreview
            className={!!isRejected && 'darken'}
            mediaFit={mediaFit}
            mimeType={mimeType}
            src={url}
            autoPlay={autoPlay}
          />
        ) : (
          <VideoSkeleton />
        )}

        <ButtonContainer>
          {!!isRejected && <RetryButton onClick={retryCallback} />}

          {!!onRemove && <RemoveButton onClick={removeCallback} />}
        </ButtonContainer>
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={progress * 100} />}
    </VideoContainer>
  );
};

Video.propTypes = {
  url: PropTypes.string,
  progress: PropTypes.number,
  mediaFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  onRemove: PropTypes.func,
  isRejected: PropTypes.bool,
  onRetry: PropTypes.func,
  mimeType: PropTypes.string,
  autoPlay: PropTypes.bool,
};

Video.defaultProps = {
  url: undefined,
  progress: -1,
  onRemove: undefined,
  isRejected: false,
  onRetry: undefined,
  mimeType: undefined,
  autoPlay: false,
};

export default Video;
