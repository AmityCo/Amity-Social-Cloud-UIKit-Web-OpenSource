import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import ColorThief from 'colorthief';
import { LinkIcon, VerifiedIcon } from '~/v4/social/icons';
import { Avatar, Typography } from '~/v4/core/components';
import TruncateMarkup from 'react-truncate-markup';
import styles from './StoryPreviewThumbnail.module.css';
import Community from '~/v4/icons/Community';

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
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColorsFromImage = async () => {
      if (imageRef.current && imageRef.current.complete) {
        const colorThief = new ColorThief();
        try {
          const palette = colorThief.getPalette(imageRef.current, 2);
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
    };

    if (thumbnailUrl) {
      if (imageRef.current && imageRef.current.complete) {
        extractColorsFromImage();
      } else {
        imageRef.current?.addEventListener('load', extractColorsFromImage);
      }
    } else {
      setBackgroundColor('');
    }

    return () => {
      imageRef.current?.removeEventListener('load', extractColorsFromImage);
    };
  }, [thumbnailUrl]);

  return (
    <div
      className={styles.containerWrapper}
      onClick={onClick}
      style={{
        background: backgroundColor || '#000',
      }}
    >
      <div className={styles.storyPreviewContainer}>
        <div className={styles.thumbnailMedia}>
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
        </div>
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
