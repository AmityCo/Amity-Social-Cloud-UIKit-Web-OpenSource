import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import ColorThief from 'colorthief';
import { LinkIcon, VerifiedIcon } from '~/v4/social/icons';
import { Avatar, Typography } from '~/v4/core/components';
import TruncateMarkup from 'react-truncate-markup';
import styles from './StoryPreviewThumbnail.module.css';
import Community from '~/v4/icons/Community';
import { StoryPreviewThumbnailSkeleton } from './StoryPreviewThumbnailSkeleton';

type StoryPreviewThumbnailProps = {
  thumbnailUrl?: string;
  hyperLink: {
    data: { url: string; customText: string };
    type: Amity.StoryItemType;
  }[];
  avatar: string;
  title: string;
  isOfficial?: boolean;
  onClick?: () => void;
  imageMode?: 'fit' | 'fill';
};

export const StoryPreviewThumbnail: React.FC<StoryPreviewThumbnailProps> = ({
  thumbnailUrl,
  hyperLink,
  avatar,
  title,
  isOfficial = false,
  onClick,
  imageMode = 'fill',
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log('Effect start - thumbnailUrl:', thumbnailUrl);
    setIsLoading(true);
    setImageError(false);

    if (!thumbnailUrl) {
      setBackgroundColor('');
      setImageError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = thumbnailUrl;

    img.onload = () => {
      if (imageRef.current) {
        const colorThief = new ColorThief();
        try {
          const palette = colorThief.getPalette(img, 2);
          if (palette) {
            const gradient = `linear-gradient(
              180deg,
              rgb(${palette[0].join(',')}) 0%,
              rgb(${palette[1].join(',')}) 100%
            )`;
            setBackgroundColor(gradient);
          }
        } catch (error) {
          console.error('Error extracting colors:', error);
          setBackgroundColor('');
        }
      }
      setIsLoading(false);
    };

    img.onerror = () => {
      setImageError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [thumbnailUrl]);

  const renderThumbnail = () => {
    if (imageError || !thumbnailUrl) {
      return (
        <div className={styles.fallbackThumbnail}>
          <Typography.Body>No Image Available</Typography.Body>
        </div>
      );
    }
    return (
      <>
        <img
          ref={imageRef}
          src={thumbnailUrl}
          alt="Story Thumbnail"
          className={clsx(styles.thumbnailImage, {
            [styles.imageFit]: imageMode === 'fit',
            [styles.imageCover]: imageMode === 'fill',
          })}
          crossOrigin="anonymous"
        />
        <div className={styles.shadowOverlay}></div>
      </>
    );
  };

  if (isLoading) {
    return <StoryPreviewThumbnailSkeleton />;
  }

  return (
    <div
      className={styles.containerWrapper}
      onClick={onClick}
      style={{
        background: backgroundColor || '#000',
      }}
    >
      <div className={styles.storyPreviewContainer}>
        <div className={styles.thumbnailMedia}>{renderThumbnail()}</div>
        <div className={styles.thumbnailInfo}>
          <div className={styles.userInfo}>
            <div className={styles.storyPreviewAvatar}>
              <Avatar avatarUrl={avatar} defaultImage={<Community />} />
            </div>
            <Typography.BodyBold className={styles.storyPreviewTitle}>
              <span className={styles.nameContainer}>
                <TruncateMarkup lines={1}>
                  <span>{title}</span>
                </TruncateMarkup>{' '}
                {isOfficial && <VerifiedIcon width={12} height={12} fill="white" />}
              </span>
            </Typography.BodyBold>
          </div>
        </div>

        {hyperLink[0]?.data?.url && (
          <a
            href={hyperLink[0].data.url}
            className={clsx(styles.hyperlink, styles.hyperlinkPosition)}
          >
            <LinkIcon className={styles.hyperlinkIcon} />
            <span className={styles.hyperlinkText}>
              {hyperLink[0]?.data?.customText || hyperLink[0].data.url}
            </span>
          </a>
        )}
      </div>
    </div>
  );
};
