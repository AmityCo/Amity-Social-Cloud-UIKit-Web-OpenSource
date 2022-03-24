import React from 'react';
import { FormattedMessage } from 'react-intl';
import Video from '~/core/components/Uploaders/Video';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import { Message, VideoPlayerMock, VideoThumbnail } from './styles';

export const Thumbnail = ({ item, showPlayIcon, showVideoDuration }) => {
  return (
    <VideoThumbnail
      fileId={item.data.thumbnailFileId}
      showPlayIcon={showPlayIcon}
      videoFileId={showVideoDuration && item.data.videoFileId.original}
    />
  );
};

export const Item = ({ item }) => {
  const fileId =
    item.data.videoFileId.high ||
    item.data.videoFileId.medium ||
    item.data.videoFileId.low ||
    item.data.videoFileId.original;

  if (!fileId) {
    return (
      <VideoContainer>
        <VideoPlayerMock>
          <Message>
            <FormattedMessage id="video.notReady" />
          </Message>
        </VideoPlayerMock>
      </VideoContainer>
    );
  }

  return <Video fileId={fileId} mediaFit="contain" noBorder />;
};
