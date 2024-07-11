import { Tester, CustomRenderer } from './types';

import React, { useState, useEffect, useCallback } from 'react';

import useImage from '~/v4/core/hooks/useImage';
import { UIStoryAd } from '../../StoryAd/UIStoryAd';

export const renderer: CustomRenderer = ({ story, action, config, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const { loader } = config;

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

  const onImageLoaded = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
    }
    action('play', true);
  }, [action, isPaused]);

  const onAdvertisementInfoOpen = () => {
    action('pause', true);
  };
  const onAdvertisementInfoClose = () => {
    action('play', true);
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
    <UIStoryAd
      pageId={pageId}
      ad={ad}
      adImageUrl={adImageUrl}
      avatarUrl={avatarUrl}
      currentIndex={currentIndex}
      isPaused={isPaused}
      storiesCount={storiesCount}
      renderLoader={() => loader}
      onComplete={handleProgressComplete}
      onPauseClick={pause}
      onPlayClick={play}
      onClose={onClose}
      onImageLoaded={onImageLoaded}
      onAdvertisementInfoOpen={onAdvertisementInfoOpen}
      onAdvertisementInfoClose={onAdvertisementInfoClose}
    />
  );
};

export const tester: Tester = (story) => {
  return {
    condition: !!story.ad,
    priority: 2,
  };
};

export default {
  renderer: renderer,
  tester,
};
