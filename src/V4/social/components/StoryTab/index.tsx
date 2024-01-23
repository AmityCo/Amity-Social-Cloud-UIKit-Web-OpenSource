import React, { useEffect } from 'react';
import Truncate from 'react-truncate-markup';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import {
  AddStoryButton,
  ErrorButton,
  StoryAvatar,
  StoryTabContainer,
  StoryTitle,
  StoryWrapper,
} from './styles';

import StoryRing from './StoryRing';
import { notification } from '~/core/components/Notification';

interface StoryTabProps {
  avatar: string | null;
  icon?: React.ReactNode;
  storyRing?: boolean;
  uploadingStory?: boolean;
  isErrored?: boolean;
  title?: string;
  onAddStory?: () => void;
  onClick?: () => void;
  onChange?: (file: File | null) => void;
}

const StoryTab = ({
  title = 'Story',
  storyRing = false,
  uploadingStory = false,
  isErrored = false,
  avatar,
  onClick,
  onChange,
}: StoryTabProps) => {
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

  const handleOnClick = () => {
    if (!storyRing || !onClick) return;
    onClick();
  };

  useEffect(() => {
    if (!isErrored) return;
    notification.info({
      content: 'Failed to share story',
    });
  }, [isErrored]);

  return (
    <StoryTabContainer onClick={handleOnClick}>
      <StoryWrapper>
        {storyRing && (
          <StoryRing width={48} height={48} uploading={uploadingStory} isErrored={isErrored} />
        )}
        <StoryAvatar avatar={avatar} backgroundImage={CommunityImage} />
        {!isErrored ? (
          <AddStoryButton onClick={handleAddIconClick} />
        ) : (
          <ErrorButton onClick={handleOnClick} />
        )}
      </StoryWrapper>
      <Truncate lines={1}>
        <StoryTitle>{title}</StoryTitle>
      </Truncate>
    </StoryTabContainer>
  );
};

export default StoryTab;
