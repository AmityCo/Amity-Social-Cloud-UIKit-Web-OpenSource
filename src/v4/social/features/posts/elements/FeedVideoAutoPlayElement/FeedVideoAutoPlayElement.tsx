import React, { useCallback, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { Spinner } from '~/v4/core/design/atoms/Loader';
import { RotateLeft, Volume, VolumeSlash } from '~/v4/core/design/icons';
import useSDK from '~/v4/core/hooks/useSDK';
import { resolveString } from '~/v4/core/localization';
import { useVideoFileQuery } from '~/v4/social/hooks/queries';
import {
  isVideoStreamUrl,
  useFeedVideoAutoplay,
  useFeedVideoAutoplayCandidate,
  warmPlaylist,
  WarmPlaylistLoader,
} from '~/v4/social/features/feed-video-autoplay';
import styles from './FeedVideoAutoPlayElement.module.css';

export type FeedVideoSource =
  | { kind: 'video'; fileId?: string }
  | { kind: 'clip'; fileId?: string; isMuted?: boolean }
  | { kind: 'room'; playbackUrls: string[]; isLive: boolean; isReconnecting?: boolean };

type Phase = 'idle' | 'blocked' | 'loading' | 'playing' | 'buffering' | 'ended' | 'fallback';

const RENDITIONS = ['1080p', '720p', '480p', '360p'] as const;

const PENDING_VIDEO_STATUSES = ['uploading', 'uploaded', 'transcoding'];

const ENDED_FRAME_OFFSET_SECONDS = 0.1;

const SPINNER_DELAY_MS = 1000;

const LAST_FRAME_TYPE = 'image/jpeg';

const LAST_FRAME_QUALITY = 0.8;

const PREVIEW_HLS_CONFIG = {
  maxBufferLength: 10,
  maxMaxBufferLength: 20,
};

function getStreamUrl(file: Amity.File<'video'>): string | undefined {
  const { videoUrl } = file;
  const rendition = RENDITIONS.find((candidate) => videoUrl?.[candidate]);
  return (rendition && videoUrl?.[rendition]) || videoUrl?.original || file.fileUrl;
}

function isHlsUrl(url: string) {
  try {
    return new URL(url, window.location.href).pathname.endsWith('.m3u8');
  } catch {
    return false;
  }
}

// Draws the frame on screen now, so a video scrolled back to shows where it stopped, not its thumbnail.
function captureFrame(video: HTMLVideoElement): Promise<Blob | null> {
  const { videoWidth, videoHeight } = video;
  if (!videoWidth || !videoHeight || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve(null);
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, videoWidth, videoHeight);
    return new Promise((resolve) => {
      try {
        canvas.toBlob(resolve, LAST_FRAME_TYPE, LAST_FRAME_QUALITY);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return Promise.resolve(null);
  }
}

function isBlockedByBrowser(error: unknown) {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}

function isAborted(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

function getTestState(
  phase: Phase,
  isMuted: boolean,
  isFileFailed: boolean,
  isEndedShown: boolean,
) {
  if (isFileFailed) return 'fallback';
  if (isEndedShown) return 'ended';
  if (phase === 'idle' || phase === 'blocked') return 'thumbnail';
  if (phase === 'loading' || phase === 'buffering') return 'loading';
  if (phase === 'playing') return isMuted ? 'playing_muted' : 'playing_sound';
  return phase;
}

export function getFeedVideoStatusId(autoplayKey: string) {
  return `feed-post-video-${autoplayKey}-status`;
}

export type FeedVideoAutoPlayElementProps = {
  autoplayKey: string;
  source: FeedVideoSource;
  isEligible?: boolean;
  fitVideo?: boolean;
  playIcon?: React.ReactNode;
};

export function FeedVideoAutoPlayElement({
  autoplayKey,
  source,
  isEligible = true,
  fitVideo = false,
  playIcon,
}: FeedVideoAutoPlayElementProps) {
  const { client } = useSDK();
  const {
    isAutoplayEnabled,
    isMuted: isSessionMuted,
    setIsMuted,
    setBrowserBlocked,
    getPlayback,
    savePlayback,
    getLastFrame,
    saveLastFrame: storeLastFrame,
  } = useFeedVideoAutoplay();

  const fileId = source.kind === 'room' ? undefined : source.fileId;
  const { videoFile, error: videoFileError } = useVideoFileQuery({ fileId });
  const isTranscoding = PENDING_VIDEO_STATUSES.includes(videoFile?.status ?? '');
  const isFileFailed =
    source.kind !== 'room' &&
    (!fileId || !!videoFileError || videoFile?.status === 'transcodeFailed');
  const isLive = source.kind === 'room' && source.isLive;
  const isReconnecting = source.kind === 'room' && !!source.isReconnecting;
  const isReconnectingRef = useRef(isReconnecting);
  isReconnectingRef.current = isReconnecting;
  const [reconnectCount, setReconnectCount] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const wasReconnectingRef = useRef(isReconnecting);
  const isForcedMuted = source.kind === 'clip' && !!source.isMuted;
  const isMuted = isForcedMuted || isSessionMuted;
  const segmentCount = source.kind === 'room' ? source.playbackUrls.length : 1;

  const [phase, setPhase] = useState<Phase>('idle');
  const [isSpinnerDelayOver, setIsSpinnerDelayOver] = useState(false);
  const [segment, setSegment] = useState(() =>
    Math.min(getPlayback(autoplayKey)?.segment ?? 0, Math.max(0, segmentCount - 1)),
  );
  const isFailed = phase === 'fallback' || phase === 'blocked' || isFileFailed;

  const { ref, isActive, isHosted, isOnline, release, claim } = useFeedVideoAutoplayCandidate({
    isEligible: isEligible && !isFailed,
    warm: () => {
      const warmUrl = getUrl();
      if (!warmUrl || isLive || (source.kind !== 'room' && !isHlsUrl(warmUrl))) return;
      warmPlaylist(warmUrl, client?.token?.accessToken);
    },
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastFrameUrl, setLastFrameUrl] = useState(() => getLastFrame(autoplayKey));
  const isMountedRef = useRef(true);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const saveLastFrame = useCallback(
    (frame: Blob | null) => {
      if (!frame) return;
      const url = storeLastFrame(autoplayKey, frame);
      if (url && isMountedRef.current) setLastFrameUrl(url);
    },
    [autoplayKey, storeLastFrame],
  );

  const getUrl = () => {
    if (source.kind === 'room') return source.playbackUrls[segment];
    if (!videoFile || isTranscoding || isFileFailed) return undefined;
    return getStreamUrl(videoFile);
  };
  const url = getUrl();

  useEffect(() => {
    if (!isActive) {
      setPhase((current) => (current === 'fallback' || current === 'blocked' ? current : 'idle'));
      return;
    }
    const savedPlayback = isLive ? undefined : getPlayback(autoplayKey);
    const savedSegment = Math.min(savedPlayback?.segment ?? 0, Math.max(0, segmentCount - 1));
    if (source.kind === 'room' && savedPlayback && savedSegment !== segment) {
      setSegment(savedSegment);
      return;
    }
    setPhase(savedPlayback?.isEnded ? 'idle' : 'loading');

    const video = videoRef.current;
    if (!video || !url) return;

    const isLastSegment = segment >= segmentCount - 1;
    let hls: Hls | null = null;
    let isEnded = false;
    let isCancelled = false;
    let hasRetriedMuted = false;

    const fallback = () => {
      if (isCancelled) return;
      if (!navigator.onLine || isReconnectingRef.current) {
        setPhase((current) =>
          current === 'playing' || current === 'buffering' ? 'buffering' : 'loading',
        );
        return;
      }
      setPhase('fallback');
      release();
    };

    const play = () => {
      video.play().catch((error: unknown) => {
        if (isCancelled || isAborted(error)) return;
        if (isBlockedByBrowser(error)) {
          if (!video.muted && !hasRetriedMuted) {
            hasRetriedMuted = true;
            video.muted = true;
            setIsMuted(true);
            play();
            return;
          }
          setPhase('blocked');
          setBrowserBlocked();
          release();
          return;
        }
        fallback();
      });
    };

    const handleEndedFrameReady = () => {
      if (!isCancelled && getPlayback(autoplayKey)?.isEnded) setPhase('ended');
    };
    const handleLoadedMetadata = () => {
      const playback = isLive ? undefined : getPlayback(autoplayKey);
      const isSameSegment = (playback?.segment ?? 0) === segment;
      if (playback?.isEnded && isSameSegment && Number.isFinite(video.duration)) {
        isEnded = true;
        video.addEventListener('seeked', handleEndedFrameReady, { once: true });
        video.currentTime = Math.max(0, video.duration - ENDED_FRAME_OFFSET_SECONDS);
        return;
      }
      if (playback?.position && isSameSegment) video.currentTime = playback.position;
      play();
    };
    const handlePlaying = () => {
      isEnded = false;
      setPhase('playing');
    };
    const handleWaiting = () =>
      setPhase((current) => (current === 'playing' ? 'buffering' : current));
    const handleTimeUpdate = () => {
      if (isLive || isEnded) return;
      savePlayback(autoplayKey, { position: video.currentTime, isEnded: false, segment });
    };
    const handleEnded = () => {
      if (isLive) return;
      isEnded = true;
      if (!isLastSegment) {
        savePlayback(autoplayKey, { position: 0, isEnded: false, segment: segment + 1 });
        setSegment(segment + 1);
        return;
      }
      savePlayback(autoplayKey, { position: video.currentTime, isEnded: true, segment });
      captureFrame(video).then(saveLastFrame);
      setPhase('ended');
    };
    // The feed never pauses an active video itself, so a pause here comes from the system, such as
    // headphones disconnecting. Keep playing, as on iOS and Android.
    const handleSystemPause = () => {
      if (isCancelled || isEnded || video.ended || document.hidden) return;
      play();
    };

    video.muted = isMutedRef.current;
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handleSystemPause);
    video.addEventListener('error', fallback);

    if (source.kind === 'room' || isHlsUrl(url)) {
      if (Hls.isSupported()) {
        hls = new Hls({
          ...PREVIEW_HLS_CONFIG,
          pLoader: WarmPlaylistLoader,
          xhrSetup: (xhr, requestUrl) => {
            const accessToken = client?.token?.accessToken;
            if (accessToken && !isVideoStreamUrl(requestUrl)) {
              xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            }
          },
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) fallback();
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        fallback();
      }
    } else {
      video.src = url;
    }

    return () => {
      isCancelled = true;
      if (!isLive && !isEnded && video.currentTime > 0) {
        savePlayback(autoplayKey, { position: video.currentTime, isEnded: false, segment });
      }
      if (!isLive) captureFrame(video).then(saveLastFrame);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleEndedFrameReady);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handleSystemPause);
      video.removeEventListener('error', fallback);
      video.pause();
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [
    isActive,
    url,
    isLive,
    reconnectCount,
    replayCount,
    autoplayKey,
    source.kind,
    segment,
    segmentCount,
  ]);

  useEffect(() => {
    if (wasReconnectingRef.current && !isReconnecting) setReconnectCount((count) => count + 1);
    wasReconnectingRef.current = isReconnecting;
  }, [isReconnecting]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!isActive || phase !== 'loading') {
      setIsSpinnerDelayOver(false);
      return;
    }
    const timer = window.setTimeout(() => setIsSpinnerDelayOver(true), SPINNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isActive, phase]);

  const isVideoVisible = phase === 'playing' || phase === 'buffering' || phase === 'ended';
  const canAutoplay = isHosted && isAutoplayEnabled && isOnline && !isFailed;
  const isEndedSaved = canAutoplay && !isLive && !!getPlayback(autoplayKey)?.isEnded;
  const isEndedShown = (phase === 'ended' && isActive) || (phase === 'idle' && isEndedSaved);
  // R-CONTROLS-STAY: the sound button stays and works while the video loads and after it ends.
  const isSoundButtonVisible =
    isEndedShown || (isActive && (isVideoVisible || phase === 'loading'));
  const isSpinnerVisible =
    isActive &&
    ((phase === 'loading' && isSpinnerDelayOver) || phase === 'buffering' || isReconnecting);

  const handleSoundPress = () => {
    if (isForcedMuted) return;
    setIsMuted(!isSessionMuted);
  };

  const handleReplayPress = () => {
    if (!isActive) {
      if (!claim()) return;
      savePlayback(autoplayKey, { position: 0, isEnded: false, segment: 0 });
      setSegment(0);
      return;
    }
    savePlayback(autoplayKey, { position: 0, isEnded: false, segment: 0 });
    if (segment !== 0) {
      setSegment(0);
      return;
    }
    const video = videoRef.current;
    if (!video?.currentSrc) {
      setReplayCount((count) => count + 1);
      return;
    }
    setPhase('loading');
    video.currentTime = 0;
    video.play().catch((error: unknown) => {
      if (isAborted(error)) return;
      setPhase('fallback');
      release();
    });
  };

  const soundLabel = resolveString(
    isMuted ? 'amity_social_feed_video_unmute' : 'amity_social_feed_video_mute',
  );
  const replayLabel = resolveString('amity_social_feed_video_replay');
  const testState = getTestState(phase, isMuted, isFileFailed, isEndedShown);

  return (
    <div
      ref={ref}
      className={styles.feedVideoAutoPlay}
      data-testid="feed_post_video"
      data-state={testState}
    >
      {lastFrameUrl &&
        canAutoplay &&
        (phase === 'idle' || phase === 'loading' || phase === 'ended') && (
          <img
            className={styles.feedVideoAutoPlay__lastFrame}
            data-fit={fitVideo}
            src={lastFrameUrl}
            alt=""
          />
        )}
      {isActive && (
        <video
          ref={videoRef}
          className={styles.feedVideoAutoPlay__video}
          data-visible={isVideoVisible}
          data-ended={phase === 'ended'}
          data-fit={fitVideo}
          playsInline
          muted
          preload="auto"
        />
      )}
      {!isVideoVisible && !isSpinnerVisible && !canAutoplay && playIcon && (
        <div
          className={styles.feedVideoAutoPlay__playIcon}
          data-testid="feed_post_video/play_button"
        >
          {playIcon}
        </div>
      )}
      {testState === 'fallback' && (
        <Typography.Caption
          id={getFeedVideoStatusId(autoplayKey)}
          className={styles.feedVideoAutoPlay__srOnly}
        >
          {resolveString('amity_social_label_playback_unavailable')}
        </Typography.Caption>
      )}
      {isSpinnerVisible && (
        <div className={styles.feedVideoAutoPlay__loading}>
          <Spinner variant="media" aria-label={resolveString('amity_social_loading')} />
        </div>
      )}
      {isEndedShown && (
        <div className={styles.feedVideoAutoPlay__ended}>
          <Button
            className={styles.feedVideoAutoPlay__replayButton}
            onPress={handleReplayPress}
            aria-label={replayLabel}
            data-testid="feed_post_video/replay_button"
          >
            <span className={styles.feedVideoAutoPlay__replayIconBox}>
              <RotateLeft className={styles.feedVideoAutoPlay__replayIcon} />
            </span>
            <Typography.CaptionBold className={styles.feedVideoAutoPlay__replayLabel}>
              {replayLabel}
            </Typography.CaptionBold>
          </Button>
        </div>
      )}
      {isSoundButtonVisible && (
        <Button
          className={styles.feedVideoAutoPlay__soundButton}
          onPress={handleSoundPress}
          isDisabled={isForcedMuted}
          aria-label={soundLabel}
          aria-pressed={!isMuted}
          data-testid="feed_post_video/sound_button"
          data-state={isMuted ? 'muted' : 'sound_on'}
        >
          {isMuted ? (
            <VolumeSlash className={styles.feedVideoAutoPlay__soundIcon} />
          ) : (
            <Volume className={styles.feedVideoAutoPlay__soundIcon} />
          )}
        </Button>
      )}
    </div>
  );
}
