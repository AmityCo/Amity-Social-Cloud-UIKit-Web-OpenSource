import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getFileUrl } from '~/v4/utils/getFileUrl';
import { VideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { DeletedClipView } from '~/v4/social/pages/ClipFeedPage/DeletedClipView/DeletedClipView';
import { DisplayModeEnum } from '~/v4/social/types';
import { useFeedVideoAutoplay } from '~/v4/social/features/feed-video-autoplay';
import styles from './VideoFullScreen.module.css';

type VideoFullScreenProps = {
  post: Amity.Post;
  isActive: boolean;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
  onClickVideo: ({
    postId,
    event,
    seeMoreIsOpen,
  }: {
    postId: string;
    event?: React.MouseEvent<HTMLElement>;
    seeMoreIsOpen?: boolean;
  }) => void;
  onNextVideo: () => void;
  isDragging: boolean;
  onDragging: (val: boolean) => void;
  isLocalMuted: boolean;
  onClipFailed?: (postId: string) => void;
  isLoading?: boolean;
  seeMoreIsOpen?: boolean;
  isFailed?: boolean;
};

export const VideoFullScreen = ({
  post,
  isActive,
  isDragging,
  onDragging,
  videoRefs,
  onClickVideo,
  onNextVideo,
  isLocalMuted,
  onClipFailed,
  isLoading,
  seeMoreIsOpen,
  isFailed,
}: VideoFullScreenProps) => {
  const [isClipLoading, setIsClipLoading] = useState(true);
  const [hasReportedFailure, setHasReportedFailure] = useState(false);
  const fileUrl = getFileUrl(post as Amity.Post<'clip' | 'video'>);
  const { getPlayback, savePlayback } = useFeedVideoAutoplay();
  const [initialTime] = useState(() => {
    const playback = getPlayback(post.postId);
    return playback && !playback.isEnded ? playback.position : 0;
  });

  // Create a ref for this specific video
  const currentVideoRef = useRef<HTMLVideoElement>(null);

  // Sync the video ref with the videoRefs record
  useEffect(() => {
    if (currentVideoRef.current) {
      videoRefs.current[post.postId] = currentVideoRef.current;
    }
    return () => {
      delete videoRefs.current[post.postId];
    };
  }, [post.postId, videoRefs]);

  const hasBeenActiveRef = useRef(false);

  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (!video) return;
    if (!isActive) {
      video.pause();
      if (hasBeenActiveRef.current) video.currentTime = 0;
      return;
    }
    if (!hasBeenActiveRef.current) {
      hasBeenActiveRef.current = true;
      if (initialTime > 0) {
        const seekToInitialTime = () => {
          if (video.currentTime < initialTime) video.currentTime = initialTime;
        };
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seekToInitialTime();
        else video.addEventListener('loadedmetadata', seekToInitialTime, { once: true });
      }
    }
    video.play().catch(() => {});
  }, [isActive, post.postId, videoRefs, initialTime]);

  useEffect(() => {
    const video = currentVideoRef.current;
    if (!isActive || !video) return;

    const savePosition = () =>
      savePlayback(post.postId, { position: video.currentTime, isEnded: false });

    video.addEventListener('timeupdate', savePosition);
    return () => video.removeEventListener('timeupdate', savePosition);
  }, [isActive, post.postId, savePlayback]);

  // Initialize video state when video element is first set or when video ref changes
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (video) {
      if (isActive) {
        // Ensure video plays if it's the active clip
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    }
  }, [post.postId, videoRefs, isActive]);

  // Add event listeners to track video loading state
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (!video) return;

    const handleLoadStart = () => setIsClipLoading(true);
    const handleLoadedData = () => {
      // When video is loaded and this is the active clip, ensure it starts playing
      if (isActive) {
        video.play().catch(() => {});
      }
      setIsClipLoading(false); // Video has finished loading
    };
    const handleCanPlay = () => {
      setIsClipLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [post.postId, videoRefs, isActive]);

  // Handle clip failure - only report once per post
  useEffect(() => {
    if (!fileUrl && !hasReportedFailure) {
      onClipFailed?.(post.postId);
      setHasReportedFailure(true);
    }
  }, [fileUrl, post.postId, onClipFailed, hasReportedFailure]);

  const isMuted = (post as Amity.Post<'clip'>)?.data?.isMuted || isLocalMuted;

  const handleClickVideo = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onClickVideo({ postId: post.postId, event: e, seeMoreIsOpen });
    },
    [post.postId, seeMoreIsOpen],
  );

  if (!fileUrl || isFailed) {
    return <DeletedClipView onWatchNext={onNextVideo} />;
  }

  return (
    <div className={styles.videoFullScreen__container}>
      {(isClipLoading || isLoading) && (
        <div className={styles.videoFullScreen__loadingBackground} />
      )}
      <VideoPlayer
        url={fileUrl}
        displayMode={DisplayModeEnum.MOBILE}
        isDragging={isDragging}
        onDragging={onDragging}
        isMuted={isMuted}
        autoPlay={isActive}
        loop={true}
        playsInline={true}
        preload="auto"
        initialTime={initialTime}
        externalVideoRef={currentVideoRef}
        className={styles.videoFullScreen__player}
        style={{ opacity: isClipLoading ? 0 : 1 }}
        showProgressBar={isActive && !isClipLoading && !isLoading}
        showDurationOnDragOnly={true}
        showHeader={false}
        hidePlayButton={seeMoreIsOpen || !isActive || isClipLoading || isLoading}
        hideSkipButtons={true}
        showPauseButton={false}
        onClickVideo={handleClickVideo}
      />

      <div className={styles.videoFullScreen__overlay} />
    </div>
  );
};
