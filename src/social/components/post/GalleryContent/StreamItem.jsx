import { StreamStatus } from '@amityco/js-sdk';
import React from 'react';
import StyledVideo from '~/core/components/Uploaders/Video/styles';
import useFile from '~/core/hooks/useFile';
import useStream from '~/core/hooks/useStream';
import LiveBadge from '~/social/components/LiveBadge';
import {
  LivestreamEndedThumbnail,
  LivestreamEndedVideoMessage,
  LivestreamIdleThumbnail,
  LivestreamIdleVideoMessage,
  LivestreamOverlayElements,
  LivestreamThumbnail,
  LivestreamTitle,
  RecordedBadge,
} from './StreamItem.styles';

function getUrl(stream) {
  if (stream.status === StreamStatus.Live) {
    return stream.watcherUrl?.hls?.url;
  }

  if (stream.status === StreamStatus.Recorded) {
    return stream?.recordings?.[0]?.mp4?.url;
  }

  return undefined;
}

export const Thumbnail = ({
  item,
  showPlayIcon,
  showLivestreamRecordedBadge,
  showLivestreamTitle,
}) => {
  const stream = useStream(item.data.streamId);
  const file = useFile(stream.thumbnailFileId);

  if (stream.status === StreamStatus.Idle || stream.isDeleted) {
    return <LivestreamIdleThumbnail />;
  }

  if (stream.status === StreamStatus.Ended) {
    return <LivestreamEndedThumbnail />;
  }

  return (
    <LivestreamThumbnail
      duration={stream.recordings?.[0]?.mp4?.duration}
      fileId={file?.fileId}
      overlayElements={
        <LivestreamOverlayElements>
          {stream.status === StreamStatus.Live && <LiveBadge />}
          {showLivestreamRecordedBadge && stream.status === StreamStatus.Recorded && (
            <RecordedBadge />
          )}
          {showLivestreamTitle && stream.title && <LivestreamTitle>{stream.title}</LivestreamTitle>}
        </LivestreamOverlayElements>
      }
      showPlayIcon={showPlayIcon}
    />
  );
};

export const Item = ({ item }) => {
  const stream = useStream(item.data.streamId);

  if (!stream.streamId) {
    return null;
  }

  if (stream.status === StreamStatus.Idle || stream.isDeleted) {
    return <LivestreamIdleVideoMessage />;
  }

  if (stream.status === StreamStatus.Ended) {
    return <LivestreamEndedVideoMessage />;
  }

  return (
    <StyledVideo
      isLive={stream.status === StreamStatus.Live}
      mediaFit="contain"
      noBorder
      url={getUrl(stream)}
    />
  );
};
