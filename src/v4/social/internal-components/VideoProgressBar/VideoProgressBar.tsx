import React, { useState, useEffect, useRef } from 'react';
import styles from './VideoProgressBar.module.css';
import { Typography } from '~/v4/core/components';
import { ProductTagBadge } from '~/v4/social/features/product-tagged';

interface VideoProgressBarProps {
  video: HTMLVideoElement | null;
  isVisible?: boolean;
  isDragging: boolean;
  showDurationOnDragOnly: boolean;
  productTags?: Amity.ProductTag[];
  onDragging: (val: boolean) => void;
  onClickProductTagBadge?: () => void;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
  video,
  isDragging,
  productTags,
  isVisible = true,
  showDurationOnDragOnly,
  onDragging,
  onClickProductTagBadge,
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video) return;

    const updateProgress = () => {
      if (!isDragging) {
        const current = video.currentTime;
        const total = video.duration;

        setCurrentTime(current);
        setDuration(total);

        if (total > 0) {
          const progressPercentage = (current / total) * 100;
          setProgress(progressPercentage);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadedData = () => {
      if (video.duration) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    if (video.duration && video.currentTime !== undefined) {
      updateProgress();
    }

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', updateProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [video, isDragging]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!video || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickProgress = Math.max(0, Math.min(100, (clickX / progressBarWidth) * 100));

    const newTime = (clickProgress / 100) * video.duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickProgress);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!video || !progressBarRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Set initial drag position
    setDragPosition({ x: mouseX, y: rect.height / 2 });
    onDragging(true);

    // Pause the video during dragging and remember if it was playing
    if (!video.paused) {
      (video as any).__wasPlayingBeforeScrub = true;
      video.pause();
    } else {
      (video as any).__wasPlayingBeforeScrub = false;
    }

    handleProgressClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!video || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const hoverProgress = Math.max(0, Math.min(100, (mouseX / progressBarWidth) * 100));
    const hoverTimeValue = (hoverProgress / 100) * video.duration;

    setHoverTime(hoverTimeValue);
    setHoverPosition(mouseX);

    // Update drag position for the indicator
    if (isDragging) {
      setDragPosition({ x: mouseX, y: rect.height / 2 });

      const clickX = Math.max(0, Math.min(mouseX, progressBarWidth));
      const clickProgress = Math.max(0, Math.min(100, (clickX / progressBarWidth) * 100));
      const newTime = (clickProgress / 100) * video.duration;

      video.currentTime = newTime;
      setProgress(clickProgress);
      setCurrentTime(newTime);
    }
  };

  const handleMouseUp = () => {
    if (!video || !isDragging) return;

    onDragging(false);

    // Resume playback if video was playing before scrubbing
    if ((video as any).__wasPlayingBeforeScrub) {
      video.play().catch(() => {});
    }

    delete (video as any).__wasPlayingBeforeScrub;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!video || !progressBarRef.current) return;

    // No need to call preventDefault here, we'll handle it properly in React's synthetic events

    const touch = e.touches[0];
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = touch.clientX - rect.left;
    const progressBarWidth = rect.width;

    // Set initial drag position
    setDragPosition({ x: clickX, y: rect.height / 2 });
    onDragging(true);

    // Pause the video during dragging and remember if it was playing
    if (!video.paused) {
      (video as any).__wasPlayingBeforeScrub = true;
      video.pause();
    } else {
      (video as any).__wasPlayingBeforeScrub = false;
    }

    const clickProgress = Math.max(0, Math.min(100, (clickX / progressBarWidth) * 100));

    const newTime = (clickProgress / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(clickProgress);
    setCurrentTime(newTime);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !video || !progressBarRef.current) return;

    // React's synthetic events already handle preventDefault correctly

    const touch = e.touches[0];
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const progressBarWidth = rect.width;
    const clickProgress = Math.max(0, Math.min(100, (clickX / progressBarWidth) * 100));

    // Update drag position indicator for touch events
    setDragPosition({ x: clickX, y: rect.height / 2 });

    const newTime = (clickProgress / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(clickProgress);
    setCurrentTime(newTime);
  };

  const handleTouchEnd = () => {
    if (video) {
      // Make sure video plays after touch ends
      handleMouseUp();
    }
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;
    let newTime = currentTime;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newTime = Math.max(0, currentTime - 5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newTime = Math.min(duration, currentTime + 5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newTime = Math.min(duration, currentTime + 10);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newTime = Math.max(0, currentTime - 10);
        break;
      default:
        return;
    }

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / duration) * 100);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMouseMove(e);
      };

      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };

      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          e.preventDefault(); // Prevent scrolling while dragging
          handleMouseMove({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
          } as MouseEvent);
        }
      };

      const handleGlobalTouchEnd = () => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, video]);

  if (!isVisible || !video) return null;

  return (
    <div className={styles.videoProgressContainer} tabIndex={0} onKeyDown={handleKeyDown}>
      {productTags && productTags?.length > 0 && (
        <div className={styles.productTagBadge}>
          <ProductTagBadge selectedProductTags={productTags} onClick={onClickProductTagBadge} />
        </div>
      )}
      {((showDurationOnDragOnly && isDragging) || !showDurationOnDragOnly) && (
        <div className={styles.timeDisplay}>
          <Typography.Body>{formatTime(currentTime)}</Typography.Body>
          <Typography.Body>{formatTime(duration)}</Typography.Body>
        </div>
      )}

      <div
        className={styles.progressBarContainer}
        ref={progressBarRef}
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.progressBarBackground}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }}>
            <div data-isdrag={isDragging} className={styles.progressBarThumb} />
          </div>
        </div>

        {/* Drag position indicator - only shown when dragging */}
        {isDragging && (
          <div
            className={styles.dragPositionIndicator}
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
            }}
          />
        )}
      </div>
    </div>
  );
};
