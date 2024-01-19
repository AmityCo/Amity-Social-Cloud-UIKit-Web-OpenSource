import React from 'react';
import StyledVideo from '~/core/components/Uploaders/Video/StyledVideo';
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
} from './StyledStreamItem';

function getUrl(stream: Amity.Post<'liveStream'>) {
  if (stream.status === 'live') {
    return stream.watcherUrl?.hls?.url;
  }

  if (stream.status === 'recorded') {
    return stream?.recordings?.find((recording: any) => recording.mp4)?.mp4.url;
  }

  return undefined;
}

interface ThumbnailProps {
  item?: Amity.Post<'liveStream'>;
  showPlayIcon?: boolean;
  showLivestreamRecordedBadge?: boolean;
  showLivestreamTitle?: boolean;
}

export const Thumbnail = ({
  item,
  showPlayIcon,
  showLivestreamRecordedBadge,
  showLivestreamTitle,
}: ThumbnailProps) => {
  const stream = useStream(item?.data.streamId);
  const file = useFile(stream?.thumbnailFileId);

  if (stream == null) {
    return null;
  }

  if (stream.status === 'idle' || stream.isDeleted) {
    return <LivestreamIdleThumbnail />;
  }

  if (stream.status === 'ended') {
    return <LivestreamEndedThumbnail />;
  }

  const mp4Recording = stream.recordings.find((recording) => recording.mp4)?.mp4;

  return (
    <LivestreamThumbnail
      duration={mp4Recording?.duration}
      fileId={file?.fileId}
      overlayElements={
        <LivestreamOverlayElements>
          {stream.status === 'live' && <LiveBadge />}
          {showLivestreamRecordedBadge && stream.status === 'recorded' && <RecordedBadge />}
          {showLivestreamTitle && stream.title && <LivestreamTitle>{stream.title}</LivestreamTitle>}
        </LivestreamOverlayElements>
      }
      showPlayIcon={showPlayIcon}
    />
  );
};

interface ItemProps {
  item?: Amity.Post<'liveStream'>;
}

export const Item = ({ item }: ItemProps) => {
  const stream = useStream(item?.data?.streamId);

  if (stream == null) {
    return null;
  }

  if (stream.status === 'idle' || stream.isDeleted) {
    return <LivestreamIdleVideoMessage />;
  }

  if (stream.status === 'ended') {
    return <LivestreamEndedVideoMessage />;
  }

  return (
    <StyledVideo
      isLive={stream.status === 'live'}
      mediaFit="contain"
      noBorder
      url={getUrl(stream)}
    />
  );
};
