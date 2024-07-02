import React, { useEffect, useRef, useState } from 'react';
import { VerifiedIcon } from '~/v4/social/icons';
import { Avatar, Typography } from '~/v4/core/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import TruncateMarkup from 'react-truncate-markup';
import styles from './StoryPreview.module.css';
import { PauseIcon, PlayIcon } from '~/icons';
import ColorThief from 'colorthief';
import Community from '~/v4/icons/Community';
import clsx from 'clsx';

type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

type StoryPreviewProps = {
  mediaType?: AmityStoryMediaType;
  imageMode: 'fit' | 'fill';
  width?: number;
  height?: number;
  hyperLink: {
    data: { url: string; customText: string };
    type: Amity.StoryItemType;
  }[];
  onPlay?: () => void;
  onPause?: () => void;
  avatar: string;
  title: string;
  description: string;
  duration?: number;
  isOfficial?: boolean;
};

export const StoryPreview: React.FC<StoryPreviewProps> = ({
  mediaType,
  hyperLink,
  width = '100%',
  height = '100%',
  onPlay,
  onPause,
  avatar,
  title,
  duration = 5000,
  isOfficial = true,
  imageMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  let progressInterval: NodeJS.Timeout;

  const handleMediaPlay = () => {
    setIsPlaying(true);
    if (onPlay) {
      onPlay();
    }
  };

  const handleMediaPause = () => {
    setIsPlaying(false);
    if (onPause) {
      onPause();
    }
  };

  const handleMediaComplete = () => {
    if (mediaType?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (mediaType?.type === 'image') {
      setIsPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    if (mediaType?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setProgress(0);
    }
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      handleMediaPause();
      if (mediaType?.type === 'video' && videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      handleMediaPlay();
      if (mediaType?.type === 'video' && videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  useEffect(() => {
    const extractColorsFromImage = async (url: string) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;

      img.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 2);
        if (palette) {
          const colors = palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
          setBackgroundColor(colors);
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('Error loading image for color extraction');
        setBackgroundColor([]);
        setIsLoading(false);
      };
    };

    if (mediaType?.url) {
      extractColorsFromImage(mediaType.url);
    } else {
      setBackgroundColor([]);
      setIsLoading(false);
    }

    return () => {
      setBackgroundColor([]);
      setIsLoading(true);
    };
  }, [mediaType?.url]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval = setInterval(() => {
        if (mediaType?.type === 'video' && videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          const progress = (currentTime / duration) * 100;
          setProgress(progress);

          if (progress >= 100) {
            clearInterval(progressInterval);
            handleMediaComplete();
          }
        } else if (mediaType?.type === 'image' && isImageLoaded) {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(progressInterval);
              handleMediaComplete();
              return 100;
            }
            return prevProgress + 100 / (duration / 100);
          });
        }
      }, 100);
    } else {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [isPlaying, mediaType, duration, isImageLoaded]);

  return (
    <div className={styles.storyPreviewWrapper} style={{ width, height }}>
      <div className={styles.storyPreviewContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.headerContent}>
            <div className={styles.userInfo}>
              <div className={styles.userInfoContent}>
                <div className={styles.avatarContainer}>
                  <Avatar avatarUrl={avatar} defaultImage={<Community />} />
                </div>
                <Typography.BodyBold className={styles.storyPreviewTitle}>
                  <span className={styles.nameContainer}>
                    {title} {isOfficial && <VerifiedIcon fill="white" />}
                  </span>
                </Typography.BodyBold>
              </div>
              {mediaType?.type === 'video' && (
                <div className={styles.playPauseButton} onClick={handlePlayPauseClick}>
                  {isPlaying ? (
                    <PauseIcon width={24} height={24} />
                  ) : (
                    <PlayIcon width={24} height={24} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div
            className={styles.mediaContainer}
            style={{
              background: `linear-gradient(
                180deg,
                ${backgroundColor[0] || '#000'} 0%,
                ${backgroundColor[1] || '#000'} 100%
              )`,
            }}
          >
            {mediaType?.type === 'video' ? (
              <video
                ref={videoRef}
                src={mediaType.url}
                className={styles.media}
                loop
                autoPlay
                muted
                onEnded={handleVideoEnded}
              />
            ) : (
              <>
                {!isLoading && backgroundColor.length > 0 && (
                  <img
                    ref={imageRef}
                    src={mediaType?.url}
                    alt="Story"
                    onLoad={() => setIsImageLoaded(true)}
                    className={clsx(styles.media, {
                      [styles.imageFit]: imageMode === 'fit',
                      [styles.imageCover]: imageMode === 'fill',
                    })}
                  />
                )}
              </>
            )}
          </div>

          <div className={styles.hyperLinkContainer}>
            {hyperLink[0]?.data?.url && (
              <HyperLink
                href={
                  hyperLink[0].data.url.startsWith('http')
                    ? hyperLink[0].data.url
                    : `https://${hyperLink[0].data.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <TruncateMarkup lines={1}>
                  <span>{hyperLink[0]?.data?.customText || hyperLink[0].data.url}</span>
                </TruncateMarkup>
              </HyperLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
