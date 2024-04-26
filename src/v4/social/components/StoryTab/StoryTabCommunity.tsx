import React, { useRef } from 'react';
import Truncate from 'react-truncate-markup';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import styles from './StoryTabCommunity.module.css';
import StoryRing from './StoryRing';
import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import { checkStoryPermission } from '~/utils';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { StoryTabItem } from './StoryTabItem';
import {
  AddStoryButton,
  ErrorButton,
  HiddenInput,
  StoryAvatar,
  StoryTabContainer,
  StoryTitle,
  StoryWrapper,
} from './styles';

interface StoryTabCommunityFeedProps {
  communityId: string;
}

export const StoryTabCommunityFeed: React.FC<StoryTabCommunityFeedProps> = ({ communityId }) => {
  const { onClickStory } = useNavigation();
  const { stories } = useStories({
    targetId: communityId,
    targetType: 'community',
    options: { orderBy: 'asc', sortBy: 'createdAt' },
  });
  const { avatarFileUrl } = useCommunityInfo(communityId);
  const { setFile } = useStoryContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleOnClick = () => {
    if (Array.isArray(stories) && stories.length === 0) return;
    onClickStory(communityId);
  };

  const { client } = useSDK();
  const hasStoryPermission = checkStoryPermission(client, communityId);
  const hasStoryRing = stories?.length > 0;
  const isSeen = stories.every((story) => story?.isSeen);
  const uploading = stories.some((story) => story?.syncState === 'syncing');
  const isErrored = stories.some((story) => story?.syncState === 'error');

  return (
    <StoryTabContainer>
      <StoryWrapper>
        {hasStoryRing && (
          <StoryRing
            pageId="*"
            componentId="story_tab_component"
            hasUnseen={isSeen}
            uploading={uploading}
            isErrored={isErrored}
            size={48}
          />
        )}
        <StoryAvatar
          onClick={handleOnClick}
          avatar={avatarFileUrl}
          backgroundImage={CommunityImage}
        />
        {hasStoryPermission && (
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
        <StoryTitle>Story</StoryTitle>
      </Truncate>
    </StoryTabContainer>
  );
};
