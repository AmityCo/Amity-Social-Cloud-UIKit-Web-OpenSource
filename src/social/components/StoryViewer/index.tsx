import React, { useEffect, useState } from 'react';

import {
  StoryArrowLeftButton,
  StoryArrowRightButton,
  StoryWrapper,
  ViewStoryContainer,
  ViewStoryContent,
  ViewStoryOverlay,
} from '~/social/components/StoryViewer/styles';

import Stories from 'react-insta-stories';

import { StoryRepository } from '@amityco/ts-sdk';
import { extractColors } from 'extract-colors';
import { FinalColor } from 'extract-colors/lib/types/Color';
import useImage from '~/core/hooks/useImage';

import { useIntl } from 'react-intl';
import { notification } from '~/core/components/Notification';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import { useMedia } from 'react-use';
import { renderers } from '~/social/components/StoryViewer/Renderers';
import StoryDraft from '~/social/components/StoryDraft';
import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { confirm } from '~/core/components/Confirm';
import { isAdmin, isModerator } from '~/helpers/permissions';
import { Permissions } from '~/social/constants';
import { isNonNullable } from '~/helpers/utils';
import { TrashIcon } from '~/icons';

interface StoryViewerProps {
  targetId: string;
  duration?: number;
  onClose: () => void;
}

const StoryViewer = ({ targetId, duration = 5000, onClose }: StoryViewerProps) => {
  const { stories } = useStories({
    targetId,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const { currentUserId, client } = useSDK();
  const user = useUser(currentUserId);

  const { formatMessage } = useIntl();
  const isMobile = useMedia('(max-width: 768px)');

  const [isDraft, setIsDraft] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<FinalColor[]>([]);

  const haveStoryPermission =
    client?.hasPermission(Permissions.ManageStoryPermission).community(targetId) ||
    isAdmin(user?.roles) ||
    isModerator(user?.roles);

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
    setIsDraft(true);
  };

  const handleAddIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onChange) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';

      input.addEventListener('change', (event) => {
        const selectedFile = (event.target as HTMLInputElement).files?.[0];
        onChange(selectedFile as File);
      });

      input.click();
    }
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
    setIsDraft(false);
    onClose();
    const formData = new FormData();
    formData.append('files', file);
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
    setIsDraft(false);
  };

  const formattedStories = stories?.map((story) => {
    const isImage = story?.dataType === 'image';
    const url = isImage ? story?.imageData?.fileUrl : story?.videoData?.videoUrl?.['720p'];

    return {
      ...story,
      url,
      type: isImage ? 'image' : 'video',
      actions: [
        haveStoryPermission
          ? {
              name: 'delete',
              action: () => deleteStory(story?.storyId as string),
              icon: <TrashIcon />,
            }
          : null,
      ].filter(isNonNullable),
      handleAddIconClick: (e: React.MouseEvent) => handleAddIconClick,
      onChange,
      onCreateStory,
      discardStory,
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

  const targetRootId = 'stories-viewer';

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

  if (isDraft) {
    return (
      <StoryDraft
        file={file}
        creatorAvatar={avatarUrl || communityBackgroundImage}
        onDiscardStory={discardStory}
        onCreateStory={onCreateStory}
      />
    );
  }

  return (
    <StoryWrapper>
      {!isMobile && <StoryArrowLeftButton onClick={previousStory} />}
      <ViewStoryContainer id={targetRootId}>
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
              defaultInterval={duration}
              onStoryStart={() => stories[currentIndex]?.analytics.markAsSeen()}
              onStoryEnd={increaseIndex}
              onNext={nextStory}
              onPrevious={previousStory}
              onAllStoriesEnd={onClose}
            />
          ) : null}
        </ViewStoryContent>
      </ViewStoryContainer>
      {!isMobile && <StoryArrowRightButton onClick={nextStory} />}
    </StoryWrapper>
  );
};

export default StoryViewer;
