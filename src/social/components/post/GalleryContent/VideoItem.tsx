import React from 'react';
import { FormattedMessage } from 'react-intl';
import Video from '~/core/components/Uploaders/Video';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import { Message, VideoPlayer, VideoThumbnail } from './styles';

interface ThumbnailProps {
  item?: Amity.Post<'video'>;
  showPlayIcon?: boolean;
  showVideoDuration?: boolean;
}

export const Thumbnail = ({ item, showPlayIcon, showVideoDuration }: ThumbnailProps) => {
  return (
    <VideoThumbnail
      fileId={item?.data.thumbnailFileId}
      showPlayIcon={showPlayIcon}
      videoFileId={showVideoDuration && item?.data.videoFileId.original}
    />
  );
};

interface ItemProps {
  item?: Amity.Post<'video'>;
}

export const Item = ({ item }: ItemProps) => {
  const fileId =
    item?.data.videoFileId.high ||
    item?.data.videoFileId.medium ||
    item?.data.videoFileId.low ||
    item?.data.videoFileId.original;

  if (!fileId) {
    return (
      <VideoContainer>
        <VideoPlayer>
          <Message>
            <FormattedMessage id="video.notReady" />
          </Message>
        </VideoPlayer>
      </VideoContainer>
    );
  }

  return <Video fileId={fileId} mediaFit="contain" noBorder />;
};
