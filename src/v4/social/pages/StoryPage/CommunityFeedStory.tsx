import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StoryRepository } from '@amityco/ts-sdk';
import { CreateNewStoryButton } from '~/v4/social/elements/CreateNewStoryButton';
import { Trash2Icon } from '~/icons';
import { isNonNullable } from '~/v4/helpers/utils';

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

import { useAmityPage } from '~/v4/core/hooks/uikit';
import { FileTrigger } from 'react-aria-components';

import styles from './StoryPage.module.css';
import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';
import { useMotionValue, motion } from 'framer-motion';
import useCommunityStoriesSubscription from '~/v4/social/hooks/useCommunityStoriesSubscription';
import useSDK from '~/v4/core/hooks/useSDK';

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

const isStory = (story: Amity.Story | Amity.Ad): story is Amity.Story =>
  !!(story as Amity.Story)?.storyId;

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
  const y = useMotionValue(0);
  const motionRef = useRef<HTMLDivElement>(null);
  const dragEventTarget = useRef(new EventTarget());

  const { stories } = useGetActiveStoriesByTarget({
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
            onClickCommunity: () => onClickCommunity(communityId),
          });

        return {
          renderer: newRenderer,
          tester,
        };
      }),
    [renderers, onClose, onClickCommunity, communityId],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { client, currentUserId } = useSDK();

  const [currentIndex, setCurrentIndex] = useState(0);
  const { file, setFile } = useStoryContext();

  const currentStory = stories[currentIndex];

  const isStoryCreator = isStory(currentStory)
    ? currentStory?.creator?.userId === currentUserId
    : false;
  const isModerator = isStory(currentStory)
    ? checkStoryPermission(client, currentStory?.targetId)
    : false;

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

  const confirmDeleteStory = (storyId: string) => {
    confirm({
      pageId,
      title: 'Delete this story?',
      content:
        "This story will be permanently deleted. You'll no longer to see and find this story.",
      okText: 'Delete',
      onOk: async () => {
        await StoryRepository.softDeleteStory(storyId);
        if (currentIndex === 0) {
          onClose(communityId);
        } else {
          setCurrentIndex(currentIndex - 1);
        }
        notification.success({
          content: 'Story deleted',
        });
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
          await StoryRepository.createImageStory(
            'user',
            currentUserId,
            formData,
            metadata,
            imageMode,
            items,
          );
        } else {
          if (currentUserId) {
            await StoryRepository.createVideoStory(
              'user',
              currentUserId,
              formData,
              metadata,
              items,
            );
          }
        }
        notification.success({
          content: 'Successfully shared story',
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          notification.info({
            content: error.message ?? 'Failed to share story',
          });
        }
      }
    },
    [currentUserId, notification, setFile],
  );

  const discardStory = () => {
    setFile(null);
  };
  const addStoryButton = (
    <FileTrigger
      ref={fileInputRef}
      onSelect={(e) => {
        const files = Array.from(e as FileList);
        setFile(files[0]);
      }}
    >
      <CreateNewStoryButton pageId={pageId} />
    </FileTrigger>
  );

  const increaseIndex = () => {
    if (currentIndex === stories.length - 1) {
      onBack();
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const formattedStories = stories?.map((story) => {
    if (isStory(story)) {
      const isImage = story?.dataType === 'image';
      const url = isImage ? story?.imageData?.fileUrl : story?.videoData?.videoUrl?.['720p'];

      return {
        story,
        url,
        type: isImage ? 'image' : 'video',
        actions: [
          isStoryCreator || isModerator
            ? {
                name: 'Delete',
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
        currentIndex,
        storiesCount: stories?.length,
        increaseIndex,
        pageId,
        dragEventTarget: dragEventTarget.current,
      };
    } else {
      return {
        ad: story,
        actions: [],
        pageId,
        currentIndex,
        storiesCount: stories?.length,
        increaseIndex,
      };
    }
  });

  const targetRootId = 'asc-uikit-stories-viewer';

  useEffect(() => {
    const lastStory = stories[stories.length - 1];
    if (isStory(lastStory) && lastStory?.syncState === 'syncing') {
      setCurrentIndex(stories.length - 1);
    }
    if (currentStory && isStory(currentStory)) {
      currentStory?.analytics.markAsSeen();
    }
  }, [currentIndex, stories]);

  useEffect(() => {
    if (stories.filter(isStory).every((story) => story?.isSeen)) return;
    const firstUnseenStoryIndex = stories.findIndex((story) =>
      isStory(story) ? !story?.isSeen : false,
    );

    if (firstUnseenStoryIndex !== -1) {
      setCurrentIndex(firstUnseenStoryIndex);
    }
  }, []);

  useCommunityStoriesSubscription({
    targetId: communityId,
    targetType: 'community',
  });

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

  if (!stories || stories.length === 0) return null;

  return (
    <div className={clsx(styles.storyWrapper)}>
      <ArrowLeftButton onClick={previousStory} />
      <motion.div
        id={targetRootId}
        ref={motionRef}
        data-qa-anchor={accessibilityId}
        initial={{ y: 0 }}
        drag="y"
        whileDrag={{ scale: 0.95, borderRadius: '8px', cursor: 'grabbing' }}
        dragConstraints={{ top: 0, bottom: 200 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragStart={() => {
          dragEventTarget.current.dispatchEvent(new Event('dragstart'));
        }}
        onDrag={(_, info) => {
          // Prevent dragging upwards
          if (info.point.y < info.point.y - info.offset.y) {
            y.set(0);
          }
        }}
        onDragEnd={(_, info) => {
          dragEventTarget.current.dispatchEvent(new Event('dragend'));
          if (info.offset.y > 100) {
            onSwipeDown(communityId);
          } else {
            y.set(0);
          }
        }}
        className={clsx(styles.viewStoryContainer)}
      >
        <div className={clsx(styles.viewStoryContent)}>
          <div className={clsx(styles.overlayLeft)} onClick={previousStory} />
          <div className={clsx(styles.overlayRight)} onClick={nextStory} />
          <div className={clsx(styles.viewStoryOverlay)} />
          <Stories
            key={stories?.length}
            progressWrapperStyles={{
              display: 'none',
            }}
            preventDefault
            currentIndex={currentIndex}
            stories={formattedStories}
            renderers={communityFeedRenderers as RendererObject[]}
            defaultInterval={DURATION}
            onStoryStart={() => isStory(currentStory) && currentStory?.analytics.markAsSeen()}
            onStoryEnd={nextStory}
            onNext={nextStory}
            onPrevious={previousStory}
            onAllStoriesEnd={nextStory}
          />
        </div>
      </motion.div>
      <ArrowRightButton onClick={nextStory} />
    </div>
  );
};
