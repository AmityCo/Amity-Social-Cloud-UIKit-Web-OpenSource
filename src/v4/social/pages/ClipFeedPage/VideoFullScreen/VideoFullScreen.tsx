import React, { useEffect, useState } from 'react';
import { getFileUrl } from '~/v4/utils/getFileUrl';
import { VideoProgressBar } from '~/v4/social/internal-components/VideoProgressBar';
import { Play } from '~/v4/icons/Play';
import { Button } from '~/v4/core/components/AriaButton';
import { DeletedClipView } from '~/v4/social/pages/ClipFeedPage/DeletedClipView/DeletedClipView';
import styles from './VideoFullScreen.module.css';

type VideoFullScreenProps = {
  post: Amity.Post;
  isActive: boolean;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
  onClickVideo: (postId: string, e?: React.MouseEvent) => void;
  onNextVideo: () => void;
  isDragging: boolean;
  onDragging: (val: boolean) => void;
  isLocalMuted: boolean;
  onClipFailed?: (val: boolean) => void;
  isLoading?: boolean;
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
}: VideoFullScreenProps) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isClipLoading, setIsClipLoading] = useState(true);
  const fileUrl = getFileUrl(post as Amity.Post<'clip' | 'video'>);

  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (video) {
      if (isActive) {
        video.play().catch(() => {});
        setIsPaused(false); // Ensure paused state is false when playing
      } else {
        video.pause();
        video.currentTime = 0; // optional: reset to beginning
        setIsPaused(true); // Set paused state when video is not active
      }
    }
  }, [isActive, post.postId, videoRefs]);

  // Initialize video state when video element is first set or when video ref changes
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (video) {
      setVideoElement(video); // Ensure videoElement state is updated
      if (isActive) {
        // Set initial paused state based on video's actual state
        setIsPaused(video.paused);
        // Ensure video plays if it's the active clip
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    }
  }, [post.postId, videoRefs, isActive]);

  // Add event listeners to track video play/pause state
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleLoadStart = () => setIsClipLoading(true);
    const handleLoadedData = () => {
      // When video is loaded and this is the active clip, ensure it starts playing
      if (isActive) {
        video.play().catch(() => {});
        setIsPaused(false);
      }
      setIsClipLoading(false); // Video has finished loading
    };
    const handleCanPlay = () => {
      setIsClipLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [post.postId, videoRefs, isActive]);

  if (!fileUrl) {
    onClipFailed?.(true);
    return <DeletedClipView onWatchNext={onNextVideo} />;
  }

  const isMuted = (post as Amity.Post<'clip'>)?.data?.isMuted || isLocalMuted;

  return (
    <div className={styles.videoFullScreen__container}>
      {(isClipLoading || isLoading) && (
        <div className={styles.videoFullScreen__loadingBackground} />
      )}
      <Button
        variant="default"
        onPress={() => {
          onClickVideo(post.postId);
        }}
      >
        <video
          ref={(el) => {
            if (el) {
              videoRefs.current[post.postId] = el;
              setVideoElement(el); // Update state to trigger progress bar re-render
            }
          }}
          src={fileUrl}
          loop
          playsInline
          className={styles.videoFullScreen__player}
          muted={isMuted}
          preload="auto"
          autoPlay={isActive}
          style={{ opacity: isClipLoading ? 0 : 1 }}
        />
      </Button>

      <div className={styles.videoFullScreen__overlay} />

      {isPaused && isActive && !isClipLoading && !isLoading && (
        <Button
          variant="text"
          className={styles.videoFullScreen__playButtonOverlay}
          onPress={() => {
            onClickVideo(post.postId);
          }}
        >
          <div className={styles.videoFullScreen__playButton}>
            <Play className={styles.videoFullScreen__playButtonIcon} />
          </div>
        </Button>
      )}

      <VideoProgressBar
        video={videoElement}
        isVisible={isActive && !isClipLoading && !isLoading}
        isDragging={isDragging}
        onDragging={onDragging}
      />
    </div>
  );
};
