import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { Button } from '~/v4/core/natives/Button';

import styles from './storyAd.module.css';
import clsx from 'clsx';

import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';
import { StoryAdInformation } from '../../StoryAdInformation/StoryAdInformation';
import InfoCircle from '~/v4/icons/InfoCircle';
import { AdsBadge } from '../../AdsBadge/AdsBadge';
import { Avatar, Typography } from '~/v4/core/components/index';
import Broadcast from '~/v4/icons/Broadcast';
import useImage from '~/v4/core/hooks/useImage';
import { PauseIcon, PlayIcon } from '~/icons/index';
import { CloseButton } from '~/v4/social/elements/index';

export const renderer: CustomRenderer = ({ story, action, config, onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const [isAdvertisementInfoOpen, setIsAdvertisementInfoOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { loader } = config;
  const imageRef = useRef<HTMLImageElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const { ad, currentIndex, storiesCount, increaseIndex, pageId, dragEventTarget } = story;

  const play = () => {
    action('play', true);
    setIsPaused(false);
  };
  const pause = () => {
    action('pause', true);
    setIsPaused(true);
  };

  const avatarFile = useImage({ fileId: ad?.advertiser?.avatar?.fileId });
  const avatarUrl = avatarFile || ad?.advertiser?.avatar?.fileUrl || '';

  const adImageFile = useImage({ fileId: ad?.image9_16?.fileId });
  const adImageUrl = adImageFile || ad?.image9_16?.fileUrl || '';

  const imageLoaded = useCallback(() => {
    setLoaded(true);
    if (isPaused) {
      setIsPaused(false);
    }
    action('play', true);
  }, [action, isPaused]);

  const openAdvertisementInfo = () => {
    action('pause', true);
    setIsAdvertisementInfoOpen(true);
  };
  const closeAdvertisementInfo = () => {
    action('play', true);
    setIsAdvertisementInfoOpen(false);
  };

  const handleProgressComplete = () => {
    increaseIndex();
  };

  useEffect(() => {
    if (dragEventTarget) {
      const handleDragStart = () => {
        action('pause', true);
        setIsPaused(true);
      };
      const handleDragEnd = () => {
        action('play', true);
        setIsPaused(false);
      };

      dragEventTarget.current?.addEventListener('dragstart', handleDragStart);
      dragEventTarget.current?.addEventListener('dragend', handleDragEnd);

      return () => {
        dragEventTarget.current?.removeEventListener('dragstart', handleDragStart);
        dragEventTarget.current?.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [dragEventTarget]);

  if (!ad) {
    return null;
  }

  return (
    <div className={styles.rendererContainer} ref={targetRef}>
      <StoryProgressBar
        pageId={pageId}
        duration={5000}
        currentIndex={currentIndex}
        storiesCount={storiesCount}
        isPaused={isPaused || isAdvertisementInfoOpen}
        onComplete={handleProgressComplete}
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
              onClick={play}
            />
          ) : (
            <PauseIcon
              className={styles.pauseStoryButton}
              data-qa-anchor="pause_button"
              onClick={pause}
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
          onLoad={imageLoaded}
          alt="Story Image"
          crossOrigin="anonymous"
        />
      </div>

      {!loaded && <div className={styles.loadingOverlay}>{loader || <div>loading...</div>}</div>}

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
      <Button className={styles.infoIcon__button} onPress={() => openAdvertisementInfo()}>
        <InfoCircle className={styles.infoIcon} />
      </Button>
      <StoryAdInformation
        ad={ad}
        isOpen={isAdvertisementInfoOpen}
        targetRef={targetRef}
        onOpenChange={(open) => !open && closeAdvertisementInfo()}
      />
    </div>
  );
};

export const tester: Tester = (story) => {
  return {
    condition: !!story.ad,
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
