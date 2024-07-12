import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StoryRepository } from '@amityco/ts-sdk';
import { isNonNullable } from '~/v4/helpers/utils';
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
import useSDK from '~/v4/core/hooks/useSDK';
import {
  CustomRendererProps,
  RendererObject,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { TrashIcon } from '~/v4/social/icons';
import { CreateNewStoryButton } from '~/v4/social/elements/CreateNewStoryButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { FileTrigger } from 'react-aria-components';
import { useMotionValue, motion } from 'framer-motion';
import useCommunityStoriesSubscription from '~/v4/social/hooks/useCommunityStoriesSubscription';

import styles from './StoryPage.module.css';

const DURATION = 5000;

const isStory = (story: Amity.Story | Amity.Ad): story is Amity.Story =>
  !!(story as Amity.Story)?.storyId;

interface GlobalFeedStoryProps {
  pageId?: string;
  targetId: string;
  targetIds: string[];
  onChangePage?: () => void;
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
  pageId = '*',
  targetId,
  targetIds,
  onChangePage,
  onClickStory,
  goToDraftStoryPage,
  onClose,
  onSwipeDown,
  onClickCommunity,
}) => {
  const { accessibilityId } = useAmityPage({ pageId });
  const { confirm } = useConfirmContext();
  const notification = useNotifications();
  const { client, currentUserId } = useSDK();
  const { file, setFile } = useStoryContext();
  const y = useMotionValue(0);
  const motionRef = useRef<HTMLDivElement>(null);
  const dragEventTarget = useRef(new EventTarget());

  const [currentIndex, setCurrentIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { stories } = useGetActiveStoriesByTarget({
    targetType: 'community',
    targetId,
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const globalFeedRenderers = useMemo(
    () =>
      renderers.map(({ renderer, tester }) => {
        const newRenderer = (props: CustomRendererProps) =>
          renderer({
            ...props,
            onClose: () => onClose(targetId),
            onClickCommunity: () => onClickCommunity(targetId),
          });

        return {
          renderer: newRenderer,
          tester,
        };
      }),
    [renderers, onClose, onSwipeDown, onClickCommunity, targetId],
  );

  const currentStory = stories[currentIndex];

  const isStoryCreator = isStory(currentStory)
    ? currentStory?.creator?.userId === currentUserId
    : false;
  const isModerator = isStory(currentStory)
    ? checkStoryPermission(client, currentStory?.targetId)
    : false;

  const previousStory = () => {
    if (currentIndex === 0) {
      const currentTargetIndex = targetIds.indexOf(targetId);
      const previousTargetIndex = currentTargetIndex - 1;

      if (previousTargetIndex >= 0) {
        const previousTargetId = targetIds[previousTargetIndex];
        onClickStory(previousTargetId);
      } else {
        onChangePage?.();
      }
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const confirmDeleteStory = (storyId: string) => {
    const isLastStory = currentIndex === stories.length - 1;
    confirm({
      pageId,
      title: 'Delete this story?',
      content:
        'This story will be permanently deleted. You’ll no longer to see and find this story.',
      okText: 'Delete',
      onOk: async () => {
        await StoryRepository.softDeleteStory(storyId);
        notification.success({
          content: 'Story deleted',
        });
        if (stories.length === 1) {
          // If it's the only story, close the ViewStory screen
          onChangePage?.();
        } else if (isLastStory) {
          // If it's the last story, move to the previous one
          setCurrentIndex((prevIndex) => prevIndex - 1);
        } else {
          // For any other case (including first story), stay on the same index
          // The next story will automatically take its place
          setCurrentIndex((prevIndex) => prevIndex);
        }
      },
    });
  };

  const deleteStory = (storyId: string) => {
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
            content: 'Successfully shared story',
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
              content: 'Successfully shared story',
            });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.info({
          content: error.message ?? 'Failed to share story',
        });
      }
    }
  };

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
    if (currentIndex === stories.length - 1) return;
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
                icon: <TrashIcon className={styles.deleteIcon} />,
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

  const nextStory = () => {
    if (currentIndex === formattedStories?.length - 1) {
      const currentTargetIndex = targetIds.indexOf(targetId);
      const nextTargetIndex = currentTargetIndex + 1;

      if (nextTargetIndex < targetIds.length) {
        const nextTargetId = targetIds[nextTargetIndex];
        onClickStory(nextTargetId);
      } else {
        onChangePage?.();
      }
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const targetRootId = 'asc-uikit-stories-viewer';

  useEffect(() => {
    const lastStory = stories[stories.length - 1];
    if (isStory(lastStory) && lastStory?.syncState === 'syncing') {
      setCurrentIndex(stories.length - 1);
    }
    if (currentStory && isStory(currentStory)) {
      currentStory?.analytics.markAsSeen();
    }
  }, [currentStory, stories]);

  useEffect(() => {
    if (stories.filter(isStory).every((story) => story?.isSeen)) return;
    const firstUnseenStoryIndex = stories.findIndex((story) =>
      isStory(story) ? !story?.isSeen : false,
    );

    if (firstUnseenStoryIndex !== -1) {
      setCurrentIndex(firstUnseenStoryIndex);
    }
  }, []);

  useEffect(() => {
    if (!file) return;
    goToDraftStoryPage({
      targetId,
      targetType: 'community',
      mediaType: file.type.includes('image')
        ? { type: 'image', url: URL.createObjectURL(file) }
        : { type: 'video', url: URL.createObjectURL(file) },
      storyType: 'globalFeed',
    });
  }, [file, goToDraftStoryPage, targetId]);

  useCommunityStoriesSubscription({
    targetId,
    targetType: 'community',
  });

  if (!stories || stories.length === 0) return null;

  return (
    <div className={clsx(styles.storyWrapper)} data-qa-anchor={accessibilityId}>
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
            onSwipeDown(targetId);
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
          {/* NOTE: Do not use isPaused prop, it will cause the first video story skipped */}
          <Stories
            // hide default progress bar
            progressWrapperStyles={{
              display: 'none',
            }}
            preventDefault
            currentIndex={currentIndex}
            stories={formattedStories}
            renderers={globalFeedRenderers as RendererObject[]}
            defaultInterval={DURATION}
            onStoryStart={() => isStory(currentStory) && currentStory?.analytics.markAsSeen()}
            onStoryEnd={increaseIndex}
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
