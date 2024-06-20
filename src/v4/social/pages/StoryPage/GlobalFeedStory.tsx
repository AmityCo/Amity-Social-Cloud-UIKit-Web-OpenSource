import React, { useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { FinalColor } from 'extract-colors/lib/types/Color';
import { StoryRepository } from '@amityco/ts-sdk';
import { CreateStoryButton } from '~/v4/social/elements';
import { isNonNullable } from '~/v4/helpers/utils';
import { extractColors } from 'extract-colors';

import Stories from 'react-insta-stories';
import { renderers } from '~/v4/social/internal-components/StoryViewer/Renderers';
import { checkStoryPermission } from '~/utils';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';
import { ArrowLeftButton } from '~/v4/social/elements/ArrowLeftButton/ArrowLeftButton';
import clsx from 'clsx';
import { ArrowRightButton } from '~/v4/social/elements/ArrowRightButton/ArrowRightButton';

import styles from './StoryPage.module.css';
import { Trash2Icon } from '~/icons';
import useSDK from '~/v4/core/hooks/useSDK';
import {
  CustomRendererProps,
  RendererObject,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';

const DURATION = 5000;

interface GlobalFeedStoryProps {
  targetId: string;
  targetIds: string[];
  onChangePage: () => void;
  onClickStory: (targetId: string) => void;
  goToDraftStoryPage: (data: {
    mediaType: { type: 'image' | 'video'; url: string };
    targetId: string;
    targetType: string;
    storyType: 'globalFeed';
  }) => void;
  onClose: (targetId: string) => void;
  onSwipeDown: (targetId: string) => void;
  onClickCommunity: (targetId: string) => void;
}

export const GlobalFeedStory: React.FC<GlobalFeedStoryProps> = ({
  targetId,
  targetIds,
  onChangePage,
  onClickStory,
  goToDraftStoryPage,
  onClose,
  onSwipeDown,
  onClickCommunity,
}) => {
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { stories } = useGetActiveStoriesByTarget({
    targetType: 'community',
    targetId,
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const globalFeedRenderers = renderers.map(({ renderer, tester }) => {
    const newRenderer = (props: CustomRendererProps) =>
      renderer({
        ...props,
        onClose: () => {
          onClose(targetId);
        },
        onSwipeDown: () => onSwipeDown(targetId),
        onClickCommunity: () => onClickCommunity(targetId),
      });

    return {
      renderer: newRenderer,
      tester,
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile as File);
    }
  };

  const { client, currentUserId } = useSDK();

  const { formatMessage } = useIntl();

  const [currentIndex, setCurrentIndex] = useState(0);
  const { file, setFile } = useStoryContext();
  const [colors, setColors] = useState<FinalColor[]>([]);

  const isStoryCreator = stories[currentIndex]?.creator?.userId === currentUserId;
  const isModerator = checkStoryPermission(client, stories[currentIndex]?.targetId);

  const confirmDeleteStory = (storyId: string) => {
    const isLastStory = currentIndex === 0;
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: async () => {
        previousStory();
        if (isLastStory) onChangePage();
        await StoryRepository.softDeleteStory(storyId);
        notification.success({
          content: formatMessage({ id: 'storyViewer.notification.deleted' }),
        });
        if (isLastStory && stories.length > 1) {
          setCurrentIndex(currentIndex - 1);
        } else if (stories.length === 1) {
          onChangePage();
        }
      },
    });
  };

  const onChange = (file: File) => {
    setFile(file);
  };

  const deleteStory = async (storyId: string) => {
    confirmDeleteStory(storyId);
  };

  const onCreateStory = async (
    file: File,
    imageMode: 'fit' | 'fill',
    metadata?: Amity.Metadata,
    items?: Amity.StoryItem[],
  ) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      setFile(null);
      if (file?.type.includes('image') && currentUserId) {
        const { data: imageData } = await StoryRepository.createImageStory(
          'user',
          currentUserId,
          formData,
          metadata,
          imageMode,
          items,
        );
        if (imageData) {
          notification.success({
            content: formatMessage({ id: 'storyViewer.notification.success' }),
          });
        }
      } else {
        if (currentUserId) {
          const { data: videoData } = await StoryRepository.createVideoStory(
            'user',
            currentUserId,
            formData,
            metadata,
            items,
          );
          if (videoData) {
            notification.success({
              content: formatMessage({ id: 'storyViewer.notification.success' }),
            });
          }
        }
      }
    } catch (error) {
      notification.error({
        content: formatMessage({ id: 'storyViewer.notification.error' }),
      });
    }
  };

  const discardStory = () => {
    setFile(null);
  };

  const addStoryButton = (
    <CreateStoryButton pageId="story_page" componentId="*" onClick={handleAddIconClick} />
  );

  const formattedStories = stories?.map((story) => {
    const isImage = story?.dataType === 'image';
    const url = isImage ? story?.imageData?.fileUrl : story?.videoData?.videoUrl?.['720p'];

    return {
      ...story,
      url,
      type: isImage ? 'image' : 'video',
      actions: [
        isStoryCreator || isModerator
          ? {
              name: 'delete',
              action: () => deleteStory(story?.storyId as string),
              icon: (
                <Trash2Icon
                  fill={getComputedStyle(document.documentElement).getPropertyValue(
                    '--asc-color-base-default',
                  )}
                />
              ),
            }
          : null,
      ].filter(isNonNullable),
      handleAddIconClick,
      onCreateStory,
      discardStory,
      addStoryButton,
      fileInputRef,
    };
  });

  const nextStory = () => {
    if (currentIndex === formattedStories?.length - 1) {
      const currentTargetIndex = targetIds.indexOf(targetId);
      const nextTargetIndex = currentTargetIndex + 1;

      if (nextTargetIndex < targetIds.length) {
        const nextTargetId = targetIds[nextTargetIndex];
        onClickStory(nextTargetId);
      } else {
        onChangePage();
      }
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (currentIndex === 0) {
      const currentTargetIndex = targetIds.indexOf(targetId);
      const previousTargetIndex = currentTargetIndex - 1;

      if (previousTargetIndex >= 0) {
        const previousTargetId = targetIds[previousTargetIndex];
        onClickStory(previousTargetId);
      } else {
        onChangePage();
      }
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const targetRootId = 'asc-uikit-stories-viewer';

  const storyStyles = {
    width: '100%',
    height: '100%',
    objectFit:
      stories[currentIndex]?.dataType === 'image' &&
      stories[currentIndex]?.data?.imageDisplayMode === 'fill'
        ? 'cover'
        : 'contain',
    background: `linear-gradient(
               180deg,
               ${colors?.length > 0 ? colors[0].hex : '#000'} 0%,
               ${colors?.length > 0 ? colors[colors?.length - 1].hex : '#000'} 100%
             )`,
  };

  const increaseIndex = () => {
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (stories[stories.length - 1]?.syncState === 'syncing') {
      setCurrentIndex(stories.length - 1);
    }
    if (stories[currentIndex]) {
      stories[currentIndex]?.analytics.markAsSeen();
    }
  }, [currentIndex, stories]);

  useEffect(() => {
    const extractColorsFromImage = async (url: string) => {
      const colorsFromImage = await extractColors(url, {
        crossOrigin: 'anonymous',
      });

      setColors(colorsFromImage);
    };

    if (file?.type.includes('image') || stories[currentIndex]?.dataType === 'image') {
      extractColorsFromImage((stories[currentIndex]?.imageData?.fileUrl as string) ?? file);
    } else {
      setColors([]);
    }
  }, [stories, file, currentIndex]);

  if (file) {
    goToDraftStoryPage({
      targetId,
      targetType: 'community',
      mediaType: file.type.includes('image')
        ? { type: 'image', url: URL.createObjectURL(file) }
        : { type: 'video', url: URL.createObjectURL(file) },
      storyType: 'globalFeed',
    });
  }

  return (
    <div className={clsx(styles.storyWrapper)} data-qa-anchor="story_page">
      <ArrowLeftButton onClick={previousStory} />
      <div id={targetRootId} className={clsx(styles.viewStoryContainer)}>
        <input
          className={clsx(styles.hiddenInput)}
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <div className={clsx(styles.viewStoryContent)}>
          <div className={clsx(styles.overlayLeft)} onClick={previousStory} />
          <div className={clsx(styles.overlayRight)} onClick={nextStory} />
          <div className={clsx(styles.viewStoryOverlay)} />
          {formattedStories?.length > 0 ? (
            // NOTE: Do not use isPaused prop, it will cause the first video story skipped
            <Stories
              width="100%"
              height="100%"
              storyStyles={storyStyles}
              preventDefault
              currentIndex={currentIndex}
              stories={formattedStories}
              renderers={globalFeedRenderers as RendererObject[]}
              defaultInterval={DURATION}
              onStoryStart={() => stories[currentIndex]?.analytics.markAsSeen()}
              onStoryEnd={increaseIndex}
              onNext={nextStory}
              onPrevious={previousStory}
              onAllStoriesEnd={nextStory}
            />
          ) : null}
        </div>
      </div>
      <ArrowRightButton onClick={nextStory} />
    </div>
  );
};
