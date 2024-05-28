import React, { useEffect, useRef, useState } from 'react';
import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import { useMedia } from 'react-use';
import { useIntl } from 'react-intl';
import { FinalColor } from 'extract-colors/lib/types/Color';
import { StoryRepository } from '@amityco/ts-sdk';
import { CreateStoryButton } from '../../elements';
import { Trash2Icon } from '~/icons';
import { isNonNullable } from '~/v4/helpers/utils';
import { extractColors } from 'extract-colors';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  HiddenInput,
  StoryArrowLeftButton,
  StoryArrowRightButton,
  StoryWrapper,
  ViewStoryContainer,
  ViewStoryContent,
  ViewStoryOverlay,
} from '../../internal-components/StoryViewer/styles';
import Stories from 'react-insta-stories';
import { renderers } from '../../internal-components/StoryViewer/Renderers';
import { AmityDraftStoryPage } from '..';
import { checkStoryPermission } from '~/utils';
import { useStoryContext } from '../../providers/StoryProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { PageTypes } from '~/social/constants';

const DURATION = 5000;

interface GlobalFeedStoryProps {
  targetId: string;
}

export const GlobalFeedStory: React.FC<GlobalFeedStoryProps> = () => {
  const { page } = useNavigation();
  const { onClickStory, onChangePage } = useNavigation();
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { stories } = useStories({
    targetType: 'community',
    targetId:
      page.type === PageTypes.ViewStory && page.storyType === 'globalFeed' && page.targetId
        ? page.targetId
        : '',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
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
  const isMobile = useMedia('(max-width: 768px)');

  const [currentIndex, setCurrentIndex] = useState(0);
  const { file, setFile } = useStoryContext();
  const [colors, setColors] = useState<FinalColor[]>([]);

  const isStoryCreator = stories[currentIndex]?.creator?.userId === currentUserId;
  const haveStoryPermission = checkStoryPermission(client, stories[currentIndex]?.targetId);

  const confirmDeleteStory = (storyId: string) => {
    const isLastStory = currentIndex === 0;
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: async () => {
        previousStory();
        if (isLastStory) {
          onChangePage(PageTypes.NewsFeed);
        }
        await StoryRepository.softDeleteStory(storyId);
        notification.success({
          content: formatMessage({ id: 'storyViewer.notification.deleted' }),
        });
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
        isStoryCreator || haveStoryPermission
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
    if (
      page.type === PageTypes.ViewStory &&
      page.targetIds &&
      page.targetId &&
      currentIndex === formattedStories?.length - 1
    ) {
      const currentTargetIndex = page.targetIds.indexOf(page.targetId);
      const nextTargetIndex = currentTargetIndex + 1;

      if (nextTargetIndex < page.targetIds.length) {
        const nextTargetId = page.targetIds[nextTargetIndex];
        onClickStory(nextTargetId, 'globalFeed', page.targetIds);
      } else {
        onChangePage(PageTypes.NewsFeed);
      }
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (
      page.type === PageTypes.ViewStory &&
      page.targetIds &&
      page.targetId &&
      currentIndex === 0
    ) {
      const currentTargetIndex = page.targetIds.indexOf(page.targetId);
      const previousTargetIndex = currentTargetIndex - 1;

      if (previousTargetIndex >= 0) {
        const previousTargetId = page.targetIds[previousTargetIndex];
        onClickStory(previousTargetId, 'globalFeed', page.targetIds);
      } else {
        onChangePage(PageTypes.NewsFeed);
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

  if (file && page.type === PageTypes.ViewStory && page.storyType === 'globalFeed') {
    return (
      <AmityDraftStoryPage
        mediaType={
          file.type.includes('image')
            ? { type: 'image', url: URL.createObjectURL(file) }
            : { type: 'video', url: URL.createObjectURL(file) }
        }
        targetId={page.targetId}
        targetType="community"
      />
    );
  }

  return (
    <StoryWrapper data-qa-anchor="story_page">
      {!isMobile && (
        <StoryArrowLeftButton data-qa-anchor="arrow_left_button" onClick={previousStory} />
      )}
      <ViewStoryContainer id={targetRootId}>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <ViewStoryContent>
          <ViewStoryOverlay />
          {formattedStories?.length > 0 ? (
            // NOTE: Do not use isPaused prop, it will cause the first video story skipped
            <Stories
              width="100%"
              height="100%"
              storyStyles={storyStyles}
              preventDefault={!isMobile}
              currentIndex={currentIndex}
              stories={formattedStories}
              // TO FIX: need to override custom type of renderers from react-insta-stories library
              // @ts-ignore
              renderers={renderers}
              defaultInterval={DURATION}
              onStoryStart={() => stories[currentIndex]?.analytics.markAsSeen()}
              onStoryEnd={increaseIndex}
              onNext={nextStory}
              onPrevious={previousStory}
              onAllStoriesEnd={nextStory}
            />
          ) : null}
        </ViewStoryContent>
      </ViewStoryContainer>
      {!isMobile && (
        <StoryArrowRightButton data-qa-anchor="arrow_right_button" onClick={nextStory} />
      )}
    </StoryWrapper>
  );
};
