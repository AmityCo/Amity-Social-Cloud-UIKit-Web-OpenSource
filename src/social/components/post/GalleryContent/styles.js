import React from 'react';
import FormattedDuration, { TIMER_FORMAT } from 'react-intl-formatted-duration';
import styled from 'styled-components';
import Button from '~/core/components/Button';
import { ButtonContainer, ImageContainer } from '~/core/components/Uploaders/Image/styles';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import useFile from '~/core/hooks/useFile';
import { Play } from '~/icons';
import Image from '~/core/components/Uploaders/Image';
import RemoveIcon from '~/icons/Remove';

export const RemoveButton = styled(Button).attrs({
  variant: 'secondary',
  children: <RemoveIcon />,
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

export const VideoThumbnail = styled(({ className, fileId, onRemove, videoFileId }) => {
  const videoFile = useFile(videoFileId);
  const duration =
    typeof videoFile?.attributes?.metadata?.video?.duration === 'number'
      ? videoFile.attributes.metadata.video.duration
      : undefined;

  return fileId ? (
    <Image
      className={className}
      fileId={fileId}
      mediaFit="cover"
      onRemove={onRemove}
      overlayElements={
        <>
          <PlayIcon />

          {duration && (
            <Duration>
              <FormattedDuration seconds={duration} format={TIMER_FORMAT} />
            </Duration>
          )}
        </>
      }
    />
  ) : (
    <ImageContainer className={className}>
      <ButtonContainer>
        <PlayIcon />

        {duration && (
          <Duration>
            <FormattedDuration seconds={duration} format={TIMER_FORMAT} />
          </Duration>
        )}

        {!!onRemove && (
          <RemoveButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
      </ButtonContainer>
    </ImageContainer>
  );
})`
  background: #ebecef;
`;

const Message = styled.div`
  && {
    position: absolute;
    top: 50%;
    right: 1em;
    left: 1em;
    text-align: center;
    transform: translateY(-50%);
    font-size: 1.15em;
  }
`;

export const VideoMessage = styled(({ children, className, onRemove }) => (
  <VideoContainer className={className}>
    <Message>{children}</Message>
    <ButtonContainer>
      {!!onRemove && (
        <RemoveButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </ButtonContainer>
  </VideoContainer>
))``;
