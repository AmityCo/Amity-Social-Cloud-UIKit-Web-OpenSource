import React from 'react';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import UICommunityInfo from './UICommunityInfo';
import { leaveCommunityConfirmModal } from './leaveScenarioModals';

import { useCommunityInfo } from './hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { isModerator } from '~/helpers/permissions';
import { Permissions } from '~/social/constants';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';

interface CommunityInfoProps {
  communityId: string;
  setStoryFile: React.Dispatch<React.SetStateAction<File | null>>;
  stories: (Amity.Story | undefined)[];
}

const CommunityInfo = ({ communityId, setStoryFile, stories }: CommunityInfoProps) => {
  const haveStories = stories?.length > 0;
  const isStorySyncing = haveStories && stories.some((story) => story?.syncState === 'syncing');
  const isStoryErrored = haveStories && stories.some((story) => story?.syncState === 'error');
  const isSeen = haveStories && stories.every((story) => story?.isSeen);

  const { onClickStory } = useNavigation();

  const { currentUserId, client } = useSDK();
  const user = useUser(currentUserId);

  const haveStoryPermission =
    client?.hasPermission(Permissions.ManageStoryPermission).community(communityId) ||
    isModerator(user?.roles);

  const {
    community,
    communityCategories,
    avatarFileUrl,
    canEditCommunity,
    onEditCommunity,
    joinCommunity,
    leaveCommunity,
    pendingPostsCount,
    canReviewCommunityPosts,
  } = useCommunityInfo(communityId);

  const categoryNames = (communityCategories || []).map((category) => category.name);

  if (community == null) return null;

  const canLeaveCommunity = community.isJoined || false;
  const { membersCount, description, isJoined } = community;

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={categoryNames}
      pendingPostsCount={pendingPostsCount}
      postsCount={community.postsCount ?? 0}
      membersCount={membersCount}
      description={description || ''}
      isJoined={isJoined || false}
      isOfficial={community.isOfficial || false}
      isPublic={community.isPublic || false}
      avatarFileUrl={avatarFileUrl || null}
      joinCommunity={joinCommunity}
      canEditCommunity={canEditCommunity}
      canLeaveCommunity={canLeaveCommunity || false}
      canReviewPosts={canReviewCommunityPosts}
      name={community.displayName}
      postSetting={community.postSetting || CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED}
      onEditCommunity={onEditCommunity}
      onClickLeaveCommunity={() =>
        leaveCommunityConfirmModal({
          onOk: () => leaveCommunity(),
        })
      }
      setStoryFile={setStoryFile}
      haveStories={haveStories || false}
      haveStoryPermission={haveStoryPermission}
      isStorySyncing={isStorySyncing || false}
      isStoryErrored={isStoryErrored || false}
      isSeen={isSeen || false}
      onClickStory={onClickStory}
    />
  );
};

export { UICommunityInfo };
export default CommunityInfo;
