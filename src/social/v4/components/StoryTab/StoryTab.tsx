import React, { useEffect, useRef } from 'react';
import Truncate from 'react-truncate-markup';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import {
  AddStoryButton,
  ErrorButton,
  HiddenInput,
  StoryAvatar,
  StoryTabContainer,
  StoryTitle,
  StoryWrapper,
} from './styles';

import StoryRing from './StoryRing';
import { notification } from '~/core/components/Notification';

interface StoryTabProps {
  haveStoryPermission: boolean;
  avatar: string | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  icon?: React.ReactNode;
  storyRing?: boolean;
  isSeen?: boolean;
  uploadingStory?: boolean;
  isErrored?: boolean;
  title?: string;
  onAddStory?: () => void;
  onClick?: () => void;
  onChange?: (file: File | null) => void;
}

export const StoryTab = ({
  pageId = '*',
  elementId = '*',
  title = 'Story',
  haveStoryPermission = false,
  storyRing = false,
  isSeen = false,
  uploadingStory = false,
  isErrored = false,
  avatar,
  onClick,
  onChange,
}: StoryTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIconClick = () => {
    if (onChange && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onChange?.(selectedFile);
    }
  };

  const handleOnClick = () => {
    if (!storyRing || !onClick) return;
    onClick();
  };

  useEffect(() => {
    if (!isErrored) return;
    notification.info({
      content: 'Failed to share story',
    });
  }, []);

  return (
    <StoryTabContainer>
      <StoryWrapper>
        {storyRing && (
          <StoryRing
            pageId={pageId}
            isSeen={isSeen}
            uploading={uploadingStory}
            isErrored={isErrored}
          />
        )}
        <StoryAvatar onClick={handleOnClick} avatar={avatar} backgroundImage={CommunityImage} />
        {haveStoryPermission && (
          <>
            <AddStoryButton onClick={handleAddIconClick} />
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </>
        )}
        {isErrored && <ErrorButton />}
      </StoryWrapper>
      <Truncate lines={1}>
        <StoryTitle>{title}</StoryTitle>
      </Truncate>
    </StoryTabContainer>
  );
};
