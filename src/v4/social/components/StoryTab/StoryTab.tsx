import React, { useRef } from 'react';
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
import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import { checkStoryPermission } from '~/utils';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';

type AmityStoryTabComponentType = 'communityFeed' | 'globalFeed';

type AmityStoryTabComponentProps<T extends AmityStoryTabComponentType> = {
  type: T;
  communityId?: T extends 'communityFeed' ? string : never;
};

export const StoryTab = <T extends AmityStoryTabComponentType>({
  type,
  communityId,
}: AmityStoryTabComponentProps<T>) => {
  const { onClickStory } = useNavigation();
  const { stories } = useStories({
    targetId: communityId as string,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const { avatarFileUrl } = useCommunityInfo(communityId);
  const { setFile } = useStoryContext();
  const accessibilityId = '*/story_tab_component/*';

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
    if (!stories || !communityId) return;
    onClickStory(communityId);
  };

  const { client } = useSDK();
  const hasStoryPermission = checkStoryPermission(client, communityId);

  const hasStoryRing = stories?.length > 0;
  const isSeen = stories.every((story) => story?.isSeen);
  const uploading = stories.some((story) => story?.syncState === 'syncing');
  const isErrored = stories.some((story) => story?.syncState === 'error');

  const renderStoryTab = () => {
    switch (type) {
      case 'communityFeed':
        return (
          <StoryTabContainer>
            <StoryWrapper>
              {hasStoryRing && (
                <StoryRing
                  pageId="*"
                  componentId="story_tab_component"
                  isSeen={isSeen}
                  uploading={uploading}
                  isErrored={isErrored}
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
      default:
        return null;
    }
  };

  return renderStoryTab();
};
