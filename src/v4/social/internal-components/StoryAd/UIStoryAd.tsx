import React, { useState, useRef, ReactNode } from 'react';
import clsx from 'clsx';

import { Button } from '~/v4/core/natives/Button';
import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';
import InfoCircle from '~/v4/icons/InfoCircle';
import { Avatar, Typography } from '~/v4/core/components/index';
import Broadcast from '~/v4/icons/Broadcast';
import { PauseIcon, PlayIcon } from '~/icons/index';
import { CloseButton } from '~/v4/social/elements/index';
import { StoryAdInformation } from '~/v4/social/internal-components/StoryAdInformation/StoryAdInformation';
import { AdsBadge } from '~/v4/social/internal-components/AdsBadge/AdsBadge';

import styles from './UIStoryAd.module.css';

interface UIStoryAdProps {
  pageId?: string;
  ad: Amity.Ad;
  avatarUrl: string;
  adImageUrl: string;
  isPaused: boolean;
  currentIndex: number;
  storiesCount: number;
  renderLoader?: () => ReactNode;
  onComplete?: () => void;
  onPlayClick?: () => void;
  onPauseClick?: () => void;
  onClose?: () => void;
  onImageLoaded?: () => void;
  onAdvertisementInfoOpen?: () => void;
  onAdvertisementInfoClose?: () => void;
}

export const UIStoryAd = ({
  pageId = '*',
  ad,
  avatarUrl,
  adImageUrl,
  currentIndex,
  isPaused,
  storiesCount,
  renderLoader = () => <div>loading...</div>,
  onComplete = () => {},
  onPauseClick,
  onPlayClick,
  onClose,
  onImageLoaded,
  onAdvertisementInfoOpen,
  onAdvertisementInfoClose,
}: UIStoryAdProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAdvertisementInfoOpen, setIsAdvertisementInfoOpen] = useState(false);

  const openAdvertisementInfo = () => {
    setIsAdvertisementInfoOpen(true);
    onAdvertisementInfoOpen?.();
  };
  const closeAdvertisementInfo = () => {
    setIsAdvertisementInfoOpen(false);
    onAdvertisementInfoClose?.();
  };

  const imageRef = useRef<HTMLImageElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    onImageLoaded?.();
  };

  return (
    <div className={styles.rendererContainer} ref={targetRef}>
      <div className={styles.storyAd__main}>
        <StoryProgressBar
          pageId={pageId}
          duration={5000}
          currentIndex={currentIndex}
          storiesCount={storiesCount}
          isPaused={isPaused}
          onComplete={onComplete}
        />

        <div className={styles.storyAd__topBar}>
          <div className={styles.storyAd__topBar__left}>
            <div className={styles.storyAd__topBar__avatar}>
              <Avatar defaultImage={<Broadcast />} avatarUrl={avatarUrl} />
            </div>
            <div className={styles.storyAd__topBar__text}>
              <Typography.BodyBold className={styles.storyAd__topBar__advertiserName}>
                {ad.advertiser?.name}
              </Typography.BodyBold>
              <AdsBadge />
            </div>
          </div>
          <div className={styles.storyAd__topBar__right}>
            {isPaused ? (
              <PlayIcon
                className={styles.playStoryButton}
                data-qa-anchor="play_button"
                onClick={() => onPlayClick?.()}
              />
            ) : (
              <PauseIcon
                className={styles.pauseStoryButton}
                data-qa-anchor="pause_button"
                onClick={() => onPauseClick?.()}
              />
            )}
            <CloseButton
              defaultClassName={clsx(styles.storyAd__closeButton)}
              pageId={pageId}
              onPress={onClose}
            />
          </div>
        </div>

        <div className={clsx(styles.storyImageContainer)}>
          <img
            ref={imageRef}
            className={clsx(styles.storyImage)}
            data-qa-anchor="image_view"
            src={adImageUrl}
            onLoad={handleImageLoaded}
            alt="Story Image"
            crossOrigin="anonymous"
          />
        </div>

        {!isImageLoaded && <div className={styles.loadingOverlay}>{renderLoader()}</div>}

        {ad.callToActionUrl && (
          <div className={styles.hyperLinkContainer}>
            <a
              className={styles.hyperLink__text}
              href={ad.callToActionUrl}
              target="_blank"
              rel="noreferrer"
            >
              {ad.callToAction}
            </a>
          </div>
        )}
        <Button
          className={styles.infoIcon__button}
          onPress={() => {
            console.log('openAdvertisementInfo');
            openAdvertisementInfo();
          }}
        >
          <InfoCircle className={styles.infoIcon} />
        </Button>
      </div>
      <StoryAdInformation
        ad={ad}
        isOpen={isAdvertisementInfoOpen}
        targetRef={targetRef}
        onOpenChange={(open) => !open && closeAdvertisementInfo()}
      />
    </div>
  );
};
