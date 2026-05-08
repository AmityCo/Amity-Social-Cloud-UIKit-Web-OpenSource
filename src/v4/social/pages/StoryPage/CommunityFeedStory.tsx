import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';

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

import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';
import { useMotionValue, motion } from 'framer-motion';
import useSDK from '~/v4/core/hooks/useSDK';
import { PageTypes } from '~/v4/core/providers/NavigationProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './StoryPage.module.css';

interface CommunityFeedStoryProps {
  pageId?: string;
  communityId: string;
  onBack: () => void;
  onClose: (communityId: string) => void;
  onSwipeDown: (communityId: string) => void;
  onClickCommunity: (communityId: string) => void;
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: any,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
}

const MIN_IMAGE_DURATION = 5000; // 5 seconds
const MAX_IMAGE_DURATION = 10000; // 10 seconds
const DEFAULT_IMAGE_DURATION = 7000; // 7 seconds

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const { page } = useNavigation();

  const { stories: storiesData, refresh } = useGetActiveStoriesByTarget({
    targetId: communityId,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const stories = storiesData.reduce(
    (acc: (Amity.Ad | Amity.Story)[], current: Amity.Ad | Amity.Story) => {
      const isDuplicate = acc.find((item) => {
        if (isStory(item) && isStory(current)) {
          return item.storyId === current.storyId;
        }
        return false;
      });
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    },
    [],
  );

  const communityFeedRenderers = useMemo(
    () =>
      renderers.map(({ renderer, tester }) => {
        const newRenderer = (props: CustomRendererProps) =>
          renderer({
            ...props,
            onClose: () => onClose(communityId),
            onClickCommunity: () => onClickCommunity(communityId),
            onDeleteStory: () => onDeleteStory(props.story.story?.storyId as string),
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
      onClose(communityId);
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const onDeleteStory = async (storyId: string) => {
    const isLastStory = currentIndex === stories.length - 1;

    try {
      await StoryRepository.softDeleteStory(storyId);
    } catch (error) {
      setIsError(true);
      notification.info({
        content: resolveString('amity_social_failed_to_delete_story_please_try_again'),
        alignment: page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar',
      });
      return;
    }

    notification.success({
      content: resolveString('amity_social_button_delete_story_success'),
      alignment:
        page.type === PageTypes.ViewStoryPage && !isLastStory ? 'fullscreen' : 'withSidebar',
    });
    refresh();
    if (stories.length === 1) {
      onBack();
    } else if (isLastStory) {
      previousStory();
    } else {
      setCurrentIndex((prevIndex) => prevIndex);
    }
  };

  const confirmDeleteStory = (story: Amity.Story) => {
    setIsConfirmDialogOpen(true);
    confirm({
      pageId,
      title: resolveString('amity_social_delete_this_story'),
      content: resolveString('amity_social_button_delete_story_message'),
      okText: resolveString('amity_social_button_delete'),
      cancelText: resolveString('amity_social_button_cancel'),
      onOk: async () => {
        setIsBottomSheetOpen(false);
        setIsConfirmDialogOpen(false);
        await onDeleteStory(story.storyId);
      },
      onCancel: () => {
        setIsConfirmDialogOpen(false);
      },
    });
  };

  const deleteStory = (story: Amity.Story) => {
    confirmDeleteStory(story);
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
          content: resolveString('amity_social_toast_snackbar_story_shared'),
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          notification.info({
            content: resolveString('amity_social_failed_to_share_story') ?? error.message,
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
      onClose(communityId);
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
                name: resolveString('amity_common_button_delete'),
                action: () => deleteStory(story),
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
        onDeleteStory,
        onCreateStory,
        discardStory,
        addStoryButton,
        fileInputRef,
        currentIndex,
        storiesCount: stories?.length,
        increaseIndex,
        pageId,
        dragEventTarget: dragEventTarget.current,
        setIsBottomSheetOpen,
        isBottomSheetOpen,
        isConfirmDialogOpen,
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

  if (file) {
    goToDraftStoryPage(
      communityId,
      'community',
      file.type.includes('image')
        ? { type: 'image', url: URL.createObjectURL(file) }
        : { type: 'video', url: URL.createObjectURL(file) },
      'communityFeed',
    );
  }

  if (!stories || stories.length === 0) return null;

  return (
    <div className={clsx(styles.storyWrapper)}>
      {currentIndex > 0 ? (
        <ArrowLeftButton onClick={previousStory} />
      ) : (
        <div className={styles.emptyButton} />
      )}

      <motion.div
        id={targetRootId}
        ref={motionRef}
        data-testid={accessibilityId}
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
            defaultInterval={DEFAULT_IMAGE_DURATION}
            onStoryStart={() => isStory(currentStory) && currentStory?.analytics.markAsSeen()}
            onStoryEnd={nextStory}
            onNext={nextStory}
            onPrevious={previousStory}
            onAllStoriesEnd={nextStory}
          />
        </div>
      </motion.div>
      {currentIndex !== stories.length - 1 ? (
        <ArrowRightButton onClick={nextStory} />
      ) : (
        <div className={styles.emptyButton} />
      )}
    </div>
  );
};
