import React, { useEffect, useRef, useState } from 'react';
import Stories from 'react-insta-stories';
import { StoryRepository } from '@amityco/ts-sdk';
import { extractColors } from 'extract-colors';
import { FinalColor } from 'extract-colors/lib/types/Color';
import useImage from '~/core/hooks/useImage';
import { useIntl } from 'react-intl';

import { useMedia } from 'react-use';
import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';

import { isNonNullable } from '~/v4/helpers/utils';
import { ArrowLeftCircle, ArrowRightCircle, Trash2Icon } from '~/icons';

import styles from './ViewStoryPage.module.css';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { CreateStoryButton } from '../../elements';

import { renderers } from '../../internal-components/StoryViewer/Renderers';
import { checkStoryPermission } from '~/utils';
import { AmityDraftStoryPage } from '../../pages';
import { useStoryContext } from '../../providers/StoryProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

interface StoryViewerProps {
  pageId: 'story_page';
  targetId: string;
  duration?: number;
  onClose: () => void;
}

const StoryViewer = ({ pageId, targetId, duration = 5000, onClose }: StoryViewerProps) => {
  const { getConfig, isExcluded } = useCustomization();
  const pageConfig = getConfig(`${pageId}/*/*`);
  const isPageExcluded = isExcluded(`${pageId}/*/*`);
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  if (isPageExcluded) return null;

  const progressBarElementConfig = getConfig(`${pageId}/*/progress_bar`);

  const { stories } = useStories({
    targetId,
    targetType: 'community',
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

  const { currentUserId } = useSDK();

  const { formatMessage } = useIntl();
  const isMobile = useMedia('(max-width: 768px)');

  const [currentIndex, setCurrentIndex] = useState(0);
  const { file, setFile } = useStoryContext();
  const [colors, setColors] = useState<FinalColor[]>([]);

  const { client } = useSDK();

  const isStoryCreator = stories[currentIndex]?.creator?.userId === currentUserId;
  const haveStoryPermission = checkStoryPermission(client, targetId);

  const confirmDeleteStory = (storyId: string) => {
    const isLastStory = currentIndex === 0;
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: async () => {
        previousStory();
        if (isLastStory) {
          onClose();
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
    onClose();
    const formData = new FormData();
    formData.append('files', file);
    setFile(null);
    if (file?.type.includes('image')) {
      const { data: imageData } = await StoryRepository.createImageStory(
        'community',
        targetId,
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
      const { data: videoData } = await StoryRepository.createVideoStory(
        'community',
        targetId,
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
        isStoryCreator
          ? {
              name: 'delete',
              action: () => deleteStory(story?.storyId as string),
              icon: (
                <Trash2Icon
                  style={{
                    fill: 'var(--asc-color-black)',
                  }}
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

  const avatarUrl = useImage({
    fileId: stories[currentIndex]?.community?.avatarFileId,
    imageSize: 'small',
  });

  const nextStory = () => {
    if (currentIndex === stories.length - 1) {
      onClose();
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (currentIndex === 0) return;
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
    return (
      <AmityDraftStoryPage
        mediaType={
          file.type.includes('image')
            ? { type: 'image', url: URL.createObjectURL(file) }
            : { type: 'video', url: URL.createObjectURL(file) }
        }
        targetId={targetId}
        targetType="community"
      />
    );
  }

  return (
    <div className={styles.storyWrapper} data-qa-anchor="story_page">
      {!isMobile && (
        <button className={styles.storyArrowButton} onClick={previousStory}>
          <ArrowLeftCircle />
        </button>
      )}
      <div className={styles.viewStoryContainer} id={targetRootId}>
        <input
          className={styles.hiddenInput}
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <div className={styles.viewStoryContent}>
          <div className={styles.viewStoryOverlay} />
          {formattedStories?.length > 0 ? (
            // NOTE: Do not use isPaused prop, it will cause the first video story skipped
            <Stories
              progressStyles={{
                backgroundColor:
                  progressBarElementConfig.progress_color || 'var(--asc-color-white)',
              }}
              progressWrapperStyles={{
                backgroundColor:
                  progressBarElementConfig.background_color || 'var(--asc-color-secondary-shade3)',
              }}
              width="100%"
              height="100%"
              storyStyles={storyStyles}
              preventDefault={!isMobile}
              currentIndex={currentIndex}
              stories={formattedStories}
              // TO FIX: need to override custom type of renderers from react-insta-stories library
              // @ts-ignore
              renderers={renderers}
              defaultInterval={duration}
              onStoryStart={() => stories[currentIndex]?.analytics.markAsSeen()}
              onStoryEnd={increaseIndex}
              onNext={nextStory}
              onPrevious={previousStory}
              onAllStoriesEnd={onClose}
            />
          ) : null}
        </div>
      </div>
      {!isMobile && (
        <button className={styles.storyArrowButton} onClick={nextStory}>
          <ArrowRightCircle />
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
