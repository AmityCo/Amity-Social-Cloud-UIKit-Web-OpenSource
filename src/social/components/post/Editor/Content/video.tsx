import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import GalleryGrid from '~/core/components/GalleryGrid';
import Video from '~/core/components/Uploaders/Video';
import { VideoMessage, VideoThumbnail } from '~/social/components/post/GalleryContent/styles';

const StyledVideoMessage = styled(VideoMessage)`
  background: #ebecef;
`;

interface VideoContentListProps {
  items: Amity.Post[];
  onRemove: (postId: string) => void;
}

// TODO minimize duplication across video related files
const VideoContentList = ({ items, onRemove }: VideoContentListProps) => {
  const [playingPostId, setPlayingPostId] = useState(undefined);

  return (
    <GalleryGrid
      itemKey="postId"
      items={items}
      onClick={(index) => setPlayingPostId(items[index].postId)}
      renderItem={(item) => {
        if (playingPostId === item.postId) {
          const fileId =
            item.data.videoFileId.high ||
            item.data.videoFileId.medium ||
            item.data.videoFileId.low ||
            item.data.videoFileId.original;

          if (!fileId) {
            return (
              <StyledVideoMessage onRemove={() => onRemove(item.postId)}>
                <FormattedMessage id="video.notReady" />
              </StyledVideoMessage>
            );
          }

          return (
            <Video
              key={item.data.videoFileId.original}
              fileId={fileId}
              mediaFit="cover"
              noBorder
              autoPlay
              onRemove={() => onRemove(item.postId)}
            />
          );
        }

        return (
          <VideoThumbnail
            key={item.data.thumbnailFileId}
            fileId={item.data.thumbnailFileId}
            onRemove={() => onRemove(item.postId)}
          />
        );
      }}
    />
  );
};

export default VideoContentList;
