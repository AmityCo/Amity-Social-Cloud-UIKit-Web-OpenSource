import React, { useEffect, useState } from 'react';
import { getFileUrl } from '~/v4/utils/getFileUrl';
import { VideoProgressBar } from '~/v4/social/internal-components/VideoProgressBar';
import { Play } from '~/v4/icons/Play';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './VideoFullScreen.module.css';
import FailedClip from '~/v4/icons/FailedClip';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';

type VideoFullScreenProps = {
  post: Amity.Post;
  isActive: boolean;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
  onClickVideo: (postId: string, e?: React.MouseEvent) => void;
  onNextVideo: () => void;
  isDragging: boolean;
  onDragging: (val: boolean) => void;
  isLocalMuted: boolean;
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
}: VideoFullScreenProps) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  }, [isActive, post.postId]);

  // Initialize video state when video element is first set
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (video && isActive) {
      // Set initial paused state based on video's actual state
      setIsPaused(video.paused);
      // Ensure video plays if it's the active clip
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, [videoElement, isActive, post.postId]);

  // Add event listeners to track video play/pause state
  useEffect(() => {
    const video = videoRefs.current[post.postId];
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      // When video is loaded and this is the active clip, ensure it starts playing
      if (isActive) {
        video.play().catch(() => {});
        setIsPaused(false);
      }
      setIsLoading(false); // Video has finished loading
    };
    const handleCanPlay = () => setIsLoading(false);

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

  if (!fileUrl)
    return (
      <div className={styles.videoFullScreen__errorStateWrapper}>
        <IconComponent
          defaultIcon={() => <FailedClip className={styles.videoFullScreen__failedClipIcon} />}
          imgIcon={() => <FailedClip className={styles.videoFullScreen__failedClipIcon} />}
        />
        <Typography.Body className={styles.videoFullScreen__errorStateText}>
          This clip is no longer available.
        </Typography.Body>
        <Button
          variant="text"
          className={styles.videoFullScreen__errorStateButton}
          onPress={() => onNextVideo()}
        >
          <Typography.BodyBold className={styles.videoFullScreen__errorStateText}>
            Watch next clip
          </Typography.BodyBold>
        </Button>
      </div>
    );

  const isMuted = (post as Amity.Post<'clip'>)?.data?.isMuted || isLocalMuted;

  return (
    <div className={styles.videoFullScreen__container}>
      {isLoading && <div className={styles.videoFullScreen__loadingBackground} />}

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
        onClick={(e) => onClickVideo(post.postId, e)}
        autoPlay
        style={{ opacity: isLoading ? 0 : 1 }}
      />

      <div className={styles.videoFullScreen__overlay} />

      {isPaused && isActive && !isLoading && (
        <Button
          variant="text"
          className={styles.videoFullScreen__playButtonOverlay}
          onPress={() => onClickVideo(post.postId)}
        >
          <div className={styles.videoFullScreen__playButton}>
            <Play className={styles.videoFullScreen__playButtonIcon} />
          </div>
        </Button>
      )}

      <VideoProgressBar
        video={videoElement}
        isVisible={isActive && !isLoading}
        isDragging={isDragging}
        onDragging={onDragging}
      />
    </div>
  );
};
