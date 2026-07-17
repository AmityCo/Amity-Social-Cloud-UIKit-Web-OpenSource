import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from './VideoPlayerControls.module.css';
import { Play } from '~/v4/icons/Play';
import { Pause } from '~/v4/icons/Pause';
import { Backward10 } from '~/v4/icons/Backward10';
import { Forward10 } from '~/v4/icons/Forward10';
import { Fullscreen } from '~/v4/icons/Fullscreen';
import UnMuted from '~/v4/icons/UnMuted';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge/ProductTagBadge';
import clsx from 'clsx';
import Kebub from '~/v4/icons/Kebub';
import { Popover } from '~/v4/core/components/AriaPopover';
import { VideoMenu } from './VideoMenu';
import MutedFilled from '~/v4/icons/MutedFilled';
import { VIDEO_CONTROLS_AUTO_HIDE_MS } from '~/v4/social/constants';

export interface VideoPlayerControlsRef {
  showControls: () => void;
}

interface VideoPlayerControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  pageId?: string;
  productTags?: Amity.ProductTag[];
  postId?: string;
  onClickProductTagBadge?: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const VideoPlayerControls = forwardRef<VideoPlayerControlsRef, VideoPlayerControlsProps>(
  ({ videoRef, pageId, productTags = [], postId, onClickProductTagBadge }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const showControls = useCallback(() => {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setIsVisible(false);
        }
      }, VIDEO_CONTROLS_AUTO_HIDE_MS);
    }, [isPlaying]);

    useImperativeHandle(
      ref,
      () => ({
        showControls,
      }),
      [showControls],
    );

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleDurationChange = () => setDuration(video.duration);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleVolumeChange = () => setIsMuted(video.muted);

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('volumechange', handleVolumeChange);

      // Initialize values
      setDuration(video.duration || 0);
      setCurrentTime(video.currentTime || 0);
      setIsMuted(video.muted);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }, [videoRef]);

    useEffect(() => {
      return () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, []);

    const togglePlay = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      showControls();
    }, [videoRef, showControls]);

    const toggleMute = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = !video.muted;
      showControls();
    }, [videoRef, showControls]);

    const skipBackward = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    }, [videoRef, showControls]);

    const skipForward = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showControls();
    }, [videoRef, showControls]);

    const toggleFullscreen = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
      showControls();
    }, [videoRef, showControls]);

    const handleProgressClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progressBar = progressBarRef.current;
        if (!video || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        video.currentTime = percentage * video.duration;
        showControls();
      },
      [videoRef, showControls],
    );

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        className={`${styles.videoPlayerControls} ${isVisible ? styles.visible : styles.hidden}`}
        onMouseMove={showControls}
        onClick={(e) => {
          e.stopPropagation();
          showControls();
        }}
      >
        {productTags.length > 0 && (
          <div className={styles.videoPlayerControls__productTag}>
            <ProductTagBadge selectedProductTags={productTags} onClick={onClickProductTagBadge} />
          </div>
        )}

        <div className={styles.videoPlayerControls__timeDisplay}>
          <Typography.Title className={styles.videoPlayerControls__time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography.Title>
        </div>

        <div
          ref={progressBarRef}
          className={styles.videoPlayerControls__progressBar}
          onClick={handleProgressClick}
        >
          <div className={styles.videoPlayerControls__progressBar__background} />
          <div
            className={styles.videoPlayerControls__progressBar__progress}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className={styles.videoPlayerControls__buttons}>
          <div className={styles.videoPlayerControls__leftButtons}>
            <Button
              className={styles.videoPlayerControls__button}
              onPress={togglePlay}
              variant="default"
            >
              {isPlaying ? (
                <Pause
                  className={clsx(
                    styles.videoPlayerControls__icon,
                    styles.videoPlayerControls__fillIcon,
                  )}
                />
              ) : (
                <Play className={styles.videoPlayerControls__icon} />
              )}
            </Button>
            <Button
              className={styles.videoPlayerControls__button}
              onPress={skipBackward}
              variant="default"
            >
              <Backward10 className={styles.videoPlayerControls__icon} />
            </Button>
            <Button
              className={styles.videoPlayerControls__button}
              onPress={skipForward}
              variant="default"
            >
              <Forward10 className={styles.videoPlayerControls__icon} />
            </Button>
          </div>

          <div className={styles.videoPlayerControls__rightButtons}>
            <Button
              className={styles.videoPlayerControls__button}
              onPress={toggleMute}
              variant="default"
            >
              {isMuted ? (
                <UnMuted
                  className={clsx(
                    styles.videoPlayerControls__icon,
                    styles.videoPlayerControls__fillIcon,
                  )}
                />
              ) : (
                <MutedFilled
                  className={clsx(
                    styles.videoPlayerControls__icon,
                    styles.videoPlayerControls__fillIcon,
                  )}
                />
              )}
            </Button>
            <Button
              className={styles.videoPlayerControls__button}
              onPress={toggleFullscreen}
              variant="default"
            >
              <Fullscreen className={styles.videoPlayerControls__icon} />
            </Button>
            <Popover
              placement="top right"
              trigger={({ openPopover }) => (
                <Button
                  className={styles.videoPlayerControls__button}
                  onPress={openPopover}
                  variant="default"
                >
                  <Kebub
                    className={clsx(
                      styles.videoPlayerControls__icon,
                      styles.videoPlayerControls__fillIcon,
                    )}
                  />
                </Button>
              )}
            >
              {({ closePopover }) => <VideoMenu videoRef={videoRef} closePopover={closePopover} />}
            </Popover>
          </div>
        </div>
      </div>
    );
  },
);
