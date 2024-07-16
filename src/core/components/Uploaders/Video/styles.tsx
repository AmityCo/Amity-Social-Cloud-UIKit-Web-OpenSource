import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { SizeMe } from 'react-sizeme';

import Button from '~/core/components/Button';
import Skeleton from '~/core/components/Skeleton';
import LiveBadge from '~/social/components/LiveBadge';

import { ExclamationCircle, Play, Remove } from '~/icons';

export const VideoContainer = styled.div<{ border?: boolean }>`
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

const VideoPreviewContainerStyles = css<{ mediaFit?: string }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ mediaFit }) => mediaFit ?? 'cover'};
  object-position: center;
`;

type BaseVideoPreviewProps = {
  src: string;
  mimeType?: string;
  mediaFit?: string;
} & React.VideoHTMLAttributes<HTMLVideoElement>;

const BaseVideoPreview = React.forwardRef<HTMLVideoElement, BaseVideoPreviewProps>(
  ({ src, mimeType, mediaFit, ...props }, ref) => (
    <video controls controlsList="nodownload" {...props} ref={ref} data-qa-anchor="video-preview">
      <source src={src} type={mimeType} />
      <p>
        Your browser does not support this format of video. Please try again later once the server
        transcodes the video into an playable format(mp4).
      </p>
    </video>
  ),
);

export const VideoPreview = styled(BaseVideoPreview)<{ mediaFit?: string }>`
  ${VideoPreviewContainerStyles}
  cursor: pointer;
`;

export const SkeletonWrapper = styled.div<{ mediaFit?: string }>`
  ${VideoPreviewContainerStyles};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoSkeleton = () => (
  <SizeMe monitorHeight>
    {({ size }) => {
      const minSize = Math.min(size.width || 0, size.height || 0);

      return (
        <SkeletonWrapper>
          <Skeleton height={minSize} width={minSize} style={{ display: 'block' }} />
        </SkeletonWrapper>
      );
    }}
  </SizeMe>
);

const StyledRemoveIcon = styled(Remove).attrs<{ icon?: ReactNode }>({ width: 24, height: 24 })``;

export const RemoveButton = styled(Button).attrs<{
  variant?: string;
  children?: ReactNode;
}>({
  variant: 'secondary',
  children: <StyledRemoveIcon />,
})`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

export const CircleIcon = styled(ExclamationCircle).attrs<{ icon?: ReactNode }>({
  width: 24,
  height: 24,
})`
  z-index: 2;
  opacity: 0.7;
`;

export const RetryButton = styled(Button).attrs<{
  variant?: string;
  icon?: ReactNode;
  children?: ReactNode;
}>({
  variant: 'secondary',
  icon: CircleIcon,
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

export const PlayIcon = styled(Play)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export const LiveIcon = styled(LiveBadge)`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;
