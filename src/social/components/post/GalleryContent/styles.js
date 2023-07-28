import React from 'react';
import FormattedDuration, { TIMER_FORMAT } from 'react-intl-formatted-duration';
import styled from 'styled-components';
import Button from '~/core/components/Button';
import Image from '~/core/components/Uploaders/Image';
import { ButtonContainer, ImageContainer } from '~/core/components/Uploaders/Image/styles';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import useFile from '~/core/hooks/useFile';
import { Play, Remove } from '~/icons';

export const RemoveButton = styled(Button).attrs({
  variant: 'secondary',
  children: <Remove />,
})`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  max-width: 40px;
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

export const Thumbnail = styled(
  ({ className, duration, fileId, onRemove, overlayElements, showPlayIcon }) => {
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

            {duration && (
              <Duration>
                <FormattedDuration seconds={duration} format={TIMER_FORMAT} />
              </Duration>
            )}
          </>
        }
        onRemove={onRemove}
      />
    ) : (
      <ImageContainer data-qa-anchor="post-gallery-content-thumbnail" className={className}>
        <ButtonContainer>
          {overlayElements}

          {showPlayIcon && <PlayIcon data-qa-anchor="post-gallery-content-play-button" />}

          {duration && (
            <Duration>
              <FormattedDuration seconds={duration} format={TIMER_FORMAT} />
            </Duration>
          )}

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
  },
)`
  background: #ebecef;
`;

export const VideoThumbnail = styled(({ fileId, videoFileId, ...props }) => {
  const videoFile = useFile(videoFileId);
  const duration =
    typeof videoFile?.attributes?.metadata?.video?.duration === 'number'
      ? videoFile.attributes.metadata.video.duration
      : undefined;

  return <Thumbnail {...props} duration={duration} fileId={fileId} />;
})``;

const VideoPlayerMockInternal = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  transform: translateY(-50%);
  padding-bottom: 56%;
  background: #000;
`;

export const VideoPlayerMock = styled(({ children, ...props }) => (
  <div {...props}>
    <VideoPlayerMockInternal>{children}</VideoPlayerMockInternal>
  </div>
))`
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

export const VideoMessage = styled(({ children, className, onRemove }) => (
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
))``;
