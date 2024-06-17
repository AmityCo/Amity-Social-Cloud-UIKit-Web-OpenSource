import React, { useRef } from 'react';
import Truncate from 'react-truncate-markup';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import useStories from '~/social/hooks/useStories';
import useSDK from '~/core/hooks/useSDK';
import { checkStoryPermission } from '~/utils';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';

import {
  AddStoryButton,
  ErrorButton,
  HiddenInput,
  StoryAvatar,
  StoryTabContainer,
  StoryTitle,
  StoryWrapper,
} from './styles';
import { isAdmin, isModerator } from '~/helpers/permissions';
import { FormattedMessage } from 'react-intl';
import useUser from '~/core/hooks/useUser';
import { StoryRing } from '~/v4/social/elements/StoryRing/StoryRing';

interface StoryTabCommunityFeedProps {
  pageId: string;
  componentId: string;
  communityId: string;
  onStoryClick: () => void;
  onFileChange: (file: File | null) => void;
}

export const StoryTabCommunityFeed: React.FC<StoryTabCommunityFeedProps> = ({
  pageId,
  componentId,
  communityId,
  onFileChange,
  onStoryClick,
}) => {
  const { stories } = useStories({
    targetId: communityId,
    targetType: 'community',
    options: { orderBy: 'asc', sortBy: 'createdAt' },
  });
  const { avatarFileUrl } = useCommunityInfo(communityId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleOnClick = () => {
    if (Array.isArray(stories) && stories.length === 0) return;
    onStoryClick();
  };

  const { currentUserId, client } = useSDK();
  const user = useUser(currentUserId);
  const isGlobalAdmin = isAdmin(user?.roles);
  const isCommunityModerator = isModerator(user?.roles);
  const hasStoryPermission =
    isGlobalAdmin || isCommunityModerator || checkStoryPermission(client, communityId);

  const hasStoryRing = stories?.length > 0;
  const hasUnSeen = stories.some((story) => !story?.isSeen);
  const uploading = stories.some((story) => story?.syncState === 'syncing');
  const isErrored = stories.some((story) => story?.syncState === 'error');

  return (
    <StoryTabContainer>
      <StoryWrapper>
        {hasStoryRing && (
          <StoryRing
            pageId={pageId}
            componentId={componentId}
            hasUnseen={hasUnSeen}
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
        <StoryTitle>
          <FormattedMessage id="storyTab.title" />
        </StoryTitle>
      </Truncate>
    </StoryTabContainer>
  );
};
