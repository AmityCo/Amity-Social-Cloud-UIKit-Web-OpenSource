import React, { HTMLAttributes, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Button from '~/core/components/Button';
import Image from '~/core/components/Uploaders/Image';
import { ButtonContainer, ImageContainer } from '~/core/components/Uploaders/Image/styles';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import useFile from '~/core/hooks/useFile';
import { Play, Remove } from '~/icons';

export const RemoveButton = styled(Button).attrs<{
  variant?: string;
  children?: ReactNode;
}>({
  variant: 'secondary',
  children: <Remove />,
})`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

export const PlayIcon = styled(Play)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Duration = styled.div`
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  padding: 1px 0.25rem;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;

  && {
    ${({ theme }) => theme.typography.caption}
  }
`;

export interface BaseThumbnailProps {
  className?: string;
  duration?: number;
  fileId?: string;
  onRemove?: () => void;
  overlayElements?: React.ReactNode;
  showPlayIcon?: boolean;
}

const BaseThumbnail = ({
  className,
  duration = 0,
  fileId,
  onRemove,
  overlayElements,
  showPlayIcon,
}: BaseThumbnailProps) => {
  const { formatNumber } = useIntl();

  const formatDuration = (inputDuration: number) => {
    const floorHour = Math.floor(inputDuration / 60 / 60);
    const hour = formatNumber(floorHour, {
      minimumIntegerDigits: 2,
      maximumSignificantDigits: 2,
    });
    const minute = formatNumber(Math.floor((inputDuration / 60) % 60), {
      minimumIntegerDigits: 2,
      maximumSignificantDigits: 2,
    });

    const roundedSecond = Math.round((inputDuration % 60) % 60);

    const second = formatNumber(roundedSecond, {
      minimumIntegerDigits: 2,
      maximumSignificantDigits: 2,
    });

    if (floorHour === 0) {
      return `${minute}:${second}`;
    }
    return `${hour}:${minute}:${second}`;
  };

  return fileId ? (
    <Image
      data-qa-anchor="post-gallery-content-thumbnail"
      className={className}
      fileId={fileId}
      mediaFit="cover"
      overlayElements={
        <>
          {overlayElements}

          {showPlayIcon && <PlayIcon data-qa-anchor="post-gallery-content-play-button" />}

          {duration != null ? <Duration>{formatDuration(duration)}</Duration> : null}
        </>
      }
      onRemove={onRemove}
    />
  ) : (
    <ImageContainer data-qa-anchor="post-gallery-content-thumbnail" className={className}>
      <ButtonContainer>
        {overlayElements}

        {showPlayIcon && <PlayIcon data-qa-anchor="post-gallery-content-play-button" />}

        {duration != null ? <Duration>{formatDuration(duration)}</Duration> : null}

        {!!onRemove && (
          <RemoveButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
      </ButtonContainer>
    </ImageContainer>
  );
};

export const Thumbnail = styled(BaseThumbnail)`
  background: #ebecef;
`;

interface VideoThumbnailProps extends BaseThumbnailProps {
  videoFileId?: string;
}

export const VideoThumbnail = ({ fileId, videoFileId, ...props }: VideoThumbnailProps) => {
  const thumbnailFile = useFile<Amity.File<'image'>>(fileId);
  const videoFile = useFile<Amity.File<'video'>>(videoFileId);

  const duration: number | undefined =
    typeof (videoFile?.attributes?.metadata?.video as any)?.duration === 'number'
      ? (videoFile?.attributes?.metadata?.video as any).duration
      : undefined;

  if (thumbnailFile == null) return null;

  return <Thumbnail {...props} duration={duration} fileId={fileId} />;
};

const VideoPlayerMockInternal = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  transform: translateY(-50%);
  padding-bottom: 56%;
  background: #000;
`;

interface BaseVideoPlayerProps extends HTMLAttributes<HTMLDivElement> {}

const BaseVideoPlayer = ({ children, ...props }: BaseVideoPlayerProps) => (
  <div {...props}>
    <VideoPlayerMockInternal>{children}</VideoPlayerMockInternal>
  </div>
);

export const VideoPlayer = styled(BaseVideoPlayer)`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 825px;
  margin-right: auto;
  margin-left: auto;
`;

export const Message = styled.div`
  && {
    position: absolute;
    top: 50%;
    right: 1em;
    left: 1em;
    text-align: center;
    transform: translateY(-50%);
    color: #fff;
  }
`;

interface VideoMessageProps {
  className?: string;
  onRemove?: () => void;
  children?: ReactNode;
}

export const VideoMessage = ({ children, className, onRemove }: VideoMessageProps) => (
  <VideoContainer className={className}>
    <Message>{children}</Message>
    <ButtonContainer>
      {!!onRemove && (
        <RemoveButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </ButtonContainer>
  </VideoContainer>
);
