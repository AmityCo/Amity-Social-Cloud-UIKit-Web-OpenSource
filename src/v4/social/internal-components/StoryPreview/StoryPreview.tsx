import React, { useEffect, useRef, useState } from 'react';
import Community from '~/v4/icons/Community';
import Verified from '~/v4/social/icons/verified';
import { Typography } from '~/v4/core/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import TruncateMarkup from 'react-truncate-markup';
import styles from './StoryPreview.module.css';
import { Avatar } from '~/v4/core/components/Avatar/';

type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

type StoryPreviewProps = {
  mediaType?: AmityStoryMediaType;
  file?: File | null;
  imageMode: 'fit' | 'fill';

  hyperLink: {
    data: { url: string; customText: string };
    type: Amity.StoryItemType;
  }[];
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  avatar: string;
  title: string;
  description: string;
  duration?: number;
  isOfficial?: boolean;
};

export const StoryPreview: React.FC<StoryPreviewProps> = ({
  mediaType,
  file,
  hyperLink,
  onPlay,
  onPause,
  onComplete,
  avatar,
  title,
  duration = 5000,
  isOfficial = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  let progressInterval: NodeJS.Timeout;

  useEffect(() => {
    if (isPlaying) {
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            handleMediaComplete();
            return 100;
          }
          return prevProgress + 1;
        });
      }, duration / 100);
    } else {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [isPlaying, duration]);

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
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      handleMediaPause();
    } else {
      handleMediaPlay();
    }
  };

  return (
    <div className={styles.storyPreviewContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.userInfo}>
          <Avatar avatar={avatar} defaultImage={<Community />} />
          <Typography.BodyBold className={styles.storyPreviewTitle}>
            <span className={styles.nameContainer}>
              {title} {isOfficial && <Verified fill="white" />}
            </span>
          </Typography.BodyBold>
        </div>
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

      <div className={styles.mediaContainer}>
        {mediaType?.type === 'video' ? (
          <video
            ref={videoRef}
            src={file ? URL.createObjectURL(file) : mediaType.url}
            className={styles.media}
            loop
            autoPlay
            muted
          />
        ) : (
          <img
            ref={imageRef}
            src={file ? URL.createObjectURL(file) : mediaType?.url}
            className={styles.media}
            alt="Story"
          />
        )}
      </div>
    </div>
  );
};
