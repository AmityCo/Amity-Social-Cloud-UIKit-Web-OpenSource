import React from 'react';
import styled from 'styled-components';
import Button from '~/core/components/Button';
import { ButtonContainer, ImageContainer } from '~/core/components/Uploaders/Image/styles';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
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

export const VideoThumbnail = styled(({ className, fileId, onRemove }) => {
  return fileId ? (
    <Image
      className={className}
      fileId={fileId}
      mediaFit="cover"
      onRemove={onRemove}
      overlayElements={<PlayIcon />}
    />
  ) : (
    <ImageContainer className={className}>
      <ButtonContainer>
        <PlayIcon />

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
