import HLS from 'hls.js';
import React, { useCallback, useEffect, useState } from 'react';

import ProgressBar from '~/core/components/ProgressBar';
import {
  ButtonContainer,
  Content,
  LiveIcon,
  RemoveButton,
  RetryButton,
  VideoContainer,
  VideoPreview,
  VideoSkeleton,
} from './styles';

export interface StyledVideoProps {
  url?: string;
  progress?: number;
  mediaFit?: 'cover' | 'contain';
  noBorder?: boolean;
  isRejected?: boolean;
  onRemove?: () => void;
  onRetry?: () => void;
  mimeType?: string;
  autoPlay?: boolean;
  isLive?: boolean;
}

const StyledVideo = ({
  url,
  progress = -1,
  mediaFit,
  noBorder,
  onRemove,
  isRejected,
  onRetry,
  mimeType,
  autoPlay,
  isLive,
}: StyledVideoProps) => {
  const removeCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove && onRemove();
    },
    [onRemove],
  );

  const retryCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRetry && onRetry();
    },
    [onRetry],
  );

  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoEl || !url || !url.includes('m3u8')) {
      return;
    }

    if (!videoEl?.canPlayType('application/vnd.apple.mpegurl') && HLS.isSupported()) {
      const hls = new HLS();

      hls.loadSource(url);
      hls.attachMedia(videoEl);
      hls.on(HLS.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case HLS.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case HLS.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              // hls.destroy();
              break;
          }
        }
      });

      return () => hls.destroy();
    }
  }, [videoEl, isLive, url]);

  return (
    <VideoContainer border={!noBorder}>
      <Content>
        {url ? (
          <VideoPreview
            key={url} // url change does not trigger video change
            ref={(el) => setVideoEl(el)}
            className={isRejected ? 'darken' : undefined}
            mediaFit={mediaFit}
            mimeType={mimeType}
            src={url}
            autoPlay={autoPlay}
          />
        ) : (
          <VideoSkeleton />
        )}

        <ButtonContainer>
          {isLive && <LiveIcon />}

          {!!isRejected && <RetryButton onClick={retryCallback} />}

          {!!onRemove && <RemoveButton onClick={removeCallback} />}
        </ButtonContainer>
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={(progress || 0) * 100} />}
    </VideoContainer>
  );
};

export default StyledVideo;
