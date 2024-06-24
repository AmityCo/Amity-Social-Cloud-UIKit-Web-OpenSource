import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import { useIntl } from 'react-intl';
import { FinalColor } from 'extract-colors/lib/types/Color';
import { StoryRepository } from '@amityco/ts-sdk';
import { CreateNewStoryButton } from '~/v4/social/elements/CreateNewStoryButton';
import { Trash2Icon } from '~/icons';
import { isNonNullable } from '~/v4/helpers/utils';
import { extractColors } from 'extract-colors';

import Stories from 'react-insta-stories';
import { renderers } from '~/v4/social/internal-components/StoryViewer/Renderers';
import { checkStoryPermission } from '~/utils';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import {
  RendererObject,
  CustomRendererProps,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';

import clsx from 'clsx';
import { ArrowLeftButton } from '~/v4/social/elements/ArrowLeftButton';
import { ArrowRightButton } from '~/v4/social/elements/ArrowRightButton';

import styles from './StoryPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { FileTrigger } from 'react-aria-components';

interface CommunityFeedStoryProps {
  pageId?: string;
  communityId: string;
  onBack: () => void;
  onClose: (communityId: string) => void;
  onSwipeDown: (communityId: string) => void;
  onClickCommunity: (communityId: string) => void;
  goToDraftStoryPage: ({
    targetId,
    targetType,
    mediaType,
    storyType,
  }: {
    targetId: string;
    targetType: string;
    mediaType: any;
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
}

const DURATION = 5000;

export const CommunityFeedStory = ({
  pageId = '*',
  communityId,
  onBack,
  onClose,
  onSwipeDown,
  onClickCommunity,
  goToDraftStoryPage,
}: CommunityFeedStoryProps) => {
  const { accessibilityId } = useAmityPage({
    pageId,
  });
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { stories } = useStories({
    targetId: communityId,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const communityFeedRenderers = useMemo(
    () =>
      renderers.map(({ renderer, tester }) => {
        const newRenderer = (props: CustomRendererProps) =>
          renderer({
            ...props,
            onClose: () => onClose(communityId),
            onSwipeDown: () => onSwipeDown(communityId),
            onClickCommunity: () => onClickCommunity(communityId),
          });

        return {
          renderer: newRenderer,
          tester,
        };
      }),
    [renderers, onClose, onSwipeDown, onClickCommunity, communityId],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { client, currentUserId } = useSDK();

  const { formatMessage } = useIntl();

  const [currentIndex, setCurrentIndex] = useState(0);
  const { file, setFile } = useStoryContext();
  const [colors, setColors] = useState<FinalColor[]>([]);

  const isStoryCreator = stories[currentIndex]?.creator?.userId === currentUserId;
  const isModerator = checkStoryPermission(client, communityId);

  const confirmDeleteStory = (storyId: string) => {
    confirm({
      pageId,
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: async () => {
        await StoryRepository.softDeleteStory(storyId);
        notification.success({
          content: formatMessage({ id: 'storyViewer.notification.deleted' }),
        });
        if (stories.length === 1) onClose(communityId);
      },
    });
  };

  const deleteStory = async (storyId: string) => {
    confirmDeleteStory(storyId);
  };

  const onCreateStory = useCallback(
    async (
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
    },
    [currentUserId, formatMessage, notification, setFile],
  );

  const discardStory = () => {
    setFile(null);
  };
  const addStoryButton = useMemo(
    () => (
      <FileTrigger
        ref={fileInputRef}
        onSelect={(e) => {
          const files = Array.from(e as FileList);
          setFile(files[0]);
        }}
      >
        <CreateNewStoryButton pageId={pageId} />
      </FileTrigger>
    ),
    [pageId, setFile],
  );

  const storyStyles = useMemo(
    () => ({
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
    }),
    [stories, currentIndex, colors],
  );

  const increaseIndex = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const formattedStories = useMemo(
    () =>
      stories?.map((story) => {
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
          onCreateStory,
          discardStory,
          addStoryButton,
          fileInputRef,
          storyStyles,
          currentIndex,
          storiesCount: stories?.length,
          increaseIndex,
          pageId,
        };
      }),
    [
      stories,
      deleteStory,
      onCreateStory,
      discardStory,
      addStoryButton,
      fileInputRef,
      storyStyles,
      currentIndex,
      increaseIndex,
    ],
  );

  const nextStory = () => {
    if (currentIndex === stories.length - 1) {
      onBack();
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const targetRootId = 'asc-uikit-stories-viewer';

  useEffect(() => {
    if (stories[stories.length - 1]?.syncState === 'syncing') {
      setCurrentIndex(stories.length - 1);
    }
    if (stories[currentIndex]) {
      stories[currentIndex]?.analytics.markAsSeen();
    }
  }, [currentIndex, stories]);

  useEffect(() => {
    if (stories.every((story) => story?.isSeen)) return;
    const firstUnseenStoryIndex = stories.findIndex((story) => !story?.isSeen);

    if (firstUnseenStoryIndex !== -1) {
      setCurrentIndex(firstUnseenStoryIndex);
    }
  }, [stories]);

  useEffect(() => {
    if (!stories) return;
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
  }, [stories, currentIndex]);

  if (file) {
    goToDraftStoryPage({
      targetId: communityId,
      targetType: 'community',
      mediaType: file.type.includes('image')
        ? { type: 'image', url: URL.createObjectURL(file) }
        : { type: 'video', url: URL.createObjectURL(file) },
      storyType: 'communityFeed',
    });
  }

  return (
    <div className={clsx(styles.storyWrapper)} data-qa-anchor={accessibilityId}>
      <ArrowLeftButton onClick={previousStory} />
      <div id={targetRootId} className={clsx(styles.viewStoryContainer)}>
        <div className={clsx(styles.viewStoryContent)}>
          <div className={clsx(styles.overlayLeft)} onClick={previousStory} />
          <div className={clsx(styles.overlayRight)} onClick={nextStory} />
          <div className={clsx(styles.viewStoryOverlay)} />
          {formattedStories?.length > 0 ? (
            // NOTE: Do not use isPaused prop, it will cause the first video story skipped
            <Stories
              progressWrapperStyles={{
                display: 'none',
              }}
              preventDefault
              currentIndex={currentIndex}
              stories={formattedStories}
              renderers={communityFeedRenderers as RendererObject[]}
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
