import React, { useEffect, useState } from 'react';

import StoryViewerHeader from './Header';
import StoryViewerFooter from './Footer';
import {
  StoryActionItem,
  StoryActionItemText,
  StoryActionSheet,
  StoryActionSheetContent,
  StoryArrowLeftButton,
  StoryArrowRightButton,
  StoryWrapper,
  ViewStoryContainer,
  ViewStoryContent,
  ViewStoryOverlay,
} from './styles';

import Stories from 'react-insta-stories';
import useStories from '~/V4/social/hooks/useStories';
import millify from 'millify';

import { formatTimeAgo } from '~/utils';
import { StoryViewerProps } from './types';
import { StoryDraft } from '../StoryDraft';
import { StoryRepository } from '@amityco/ts-sdk';
import { extractColors } from 'extract-colors';
import { FinalColor } from 'extract-colors/lib/types/Color';
import useImage from '~/core/hooks/useImage';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { confirm } from '~/core/components/Confirm';
import { useIntl } from 'react-intl';
import { notification } from '~/core/components/Notification';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Trash from '~/V4/icons/Trash';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';

const StoryViewer = ({ targetId, duration, onClose }: StoryViewerProps) => {
  const { stories, isLoading } = useStories({
    targetId,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });
  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);

  const { onClickCommunity } = useNavigation();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [paused, setPaused] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState<Amity.Story>();
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<FinalColor[]>([]);
  const [isUploading, setUploading] = useState(false);

  const openActionSheet = () => {
    setOpen(true);
  };

  const closeActionSheet = () => {
    setOpen(false);
  };

  const confirmDeleteStory = (storyId: string) => {
    confirm({
      title: formatMessage({ id: 'storyViewer.action.confirmModal.title' }),
      content: formatMessage({ id: 'storyViewer.action.confirmModal.content' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: async () => {
        closeActionSheet();
        previousStory();
        await StoryRepository.softDeleteStory(storyId);
        notification.success({
          content: formatMessage({ id: 'storyViewer.notification.deleted' }),
        });
        if (stories?.length === 0) {
          onClose();
        }
      },
    });
  };

  const deleteStory = async (storyId: string) => {
    confirmDeleteStory(storyId);
  };

  const nextStory = () => {
    if (currentIndex === formattedStories.length - 1) {
      onClose();
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previousStory = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < formattedStories.length) {
      const updatedCurrentStory = stories[currentIndex] as Amity.Story;
      setCurrentStory({ ...updatedCurrentStory });
    }
  }, [currentIndex, stories]);

  const formattedStories = stories?.map((story) =>
    story?.dataType === 'video'
      ? {
          id: story?.storyId,
          url: story?.videoData?.fileUrl,
          type: 'video',
        }
      : {
          id: story?.storyId,
          url: story?.imageData?.fileUrl,
          type: 'image',
        },
  );

  const isCurrentStorySyncing = currentStory?.syncState === 'syncing';
  const isCurrentStoryErrored = currentStory?.syncState === 'error';
  const viewCount = millify(currentStory?.reach || 0);
  const commentCount = millify(currentStory?.commentsCount || 0);
  const likeCount = millify(currentStory?.reactions?.like || 0);

  const heading = currentStory?.community?.displayName;
  const subheading = `${formatTimeAgo(currentStory?.createdAt as string)} • By ${
    currentStory?.creator?.displayName
  }`;
  const avatarUrl = useImage({
    fileId: currentStory?.community?.avatarFileId,
    imageSize: 'small',
  });

  const isOfficial = currentStory?.community?.isOfficial || false;

  const storyPaused = isOpen || paused;

  const targetRootId = 'stories-viewer';

  const pauseStory = () => {
    setPaused(true);
  };

  const playStory = () => {
    setPaused(false);
  };

  const isCreator = currentStory?.creatorId === user?._id;

  const onCreateStory = async (
    file: File,
    imageMode: 'fit' | 'fill',
    metadata?: Amity.Metadata,
    items?: Amity.StoryItem[],
  ) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    if (file?.type.includes('image')) {
      await StoryRepository.createImageStory(
        'community',
        targetId,
        formData,
        metadata,
        imageMode,
        items,
      );
      setUploading(false);
    } else {
      await StoryRepository.createVideoStory('community', targetId, formData, metadata, items);
      setUploading(false);
    }
  };

  useEffect(() => {
    const extractColorsFromImage = async (url: string) => {
      const colorsFromImage = await extractColors(url, {
        crossOrigin: 'anonymous',
      });

      setColors(colorsFromImage);
    };

    if (currentStory?.dataType === 'image') {
      extractColorsFromImage(currentStory?.imageData?.fileUrl as string);
    } else {
      setColors([]);
    }
  }, [currentStory?.imageData?.fileUrl]);

  if (isLoading || stories?.length === 0) {
    return null;
  }

  if (file) {
    return (
      <StoryDraft
        file={file}
        creatorAvatar={avatarUrl || communityBackgroundImage}
        onDiscardStory={() => setFile(null)}
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
          <StoryViewerHeader
            heading={heading}
            subheading={subheading}
            avatarUrl={avatarUrl}
            isOfficial={isOfficial}
            isPaused={storyPaused}
            isMobile={isMobile}
            isCreator={isCreator}
            onPlay={playStory}
            onPause={pauseStory}
            onClose={onClose}
            onAction={openActionSheet}
            onClickCommunity={() => onClickCommunity(targetId)}
          />
          <Stories
            width="100%"
            height="100%"
            storyStyles={{
              width: '100vw',
              height: '100vh',
              objectFit:
                (currentStory?.data?.imageDisplayMode === 'fill' ? 'cover' : 'contain') ||
                'contain',
              background: `linear-gradient(
              180deg,
              ${colors.length > 0 ? colors[0].hex : '#000'} 0%,
              ${colors?.length > 0 ? colors[colors?.length - 1].hex : '#000'} 100%
            )`,
            }}
            preventDefault={!isMobile}
            isPaused={storyPaused}
            currentIndex={currentIndex}
            stories={formattedStories}
            defaultInterval={duration || 5000}
            onStoryStart={() => currentStory?.analytics.markAsSeen()}
            onNext={nextStory}
            onPrevious={previousStory}
            onStoryEnd={nextStory}
          />
          <StoryActionSheet
            rootId={targetRootId}
            isOpen={isOpen}
            onClose={closeActionSheet}
            detent="content-height"
            mountPoint={document.getElementById(targetRootId) as HTMLElement}
          >
            <StoryActionSheet.Container>
              <StoryActionSheet.Header />
              <StoryActionSheetContent>
                {!isCreator && (
                  <StoryActionItem onClick={() => deleteStory(currentStory?.storyId as string)}>
                    <Trash />
                    <StoryActionItemText>{formatMessage({ id: 'delete' })}</StoryActionItemText>
                  </StoryActionItem>
                )}
              </StoryActionSheetContent>
            </StoryActionSheet.Container>
            <StoryActionSheet.Backdrop onTap={closeActionSheet} />
          </StoryActionSheet>
        </ViewStoryContent>
        <StoryViewerFooter
          isUploading={isCurrentStorySyncing}
          isErrored={isCurrentStoryErrored}
          viewCount={viewCount}
          likeCount={likeCount}
          commentCount={commentCount}
        />
      </ViewStoryContainer>
      {!isMobile && <StoryArrowRightButton onClick={nextStory} />}
    </StoryWrapper>
  );
};

export default StoryViewer;
