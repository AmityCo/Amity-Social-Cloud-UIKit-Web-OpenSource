import React from 'react';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import UICommunityInfo from './UICommunityInfo';
import { leaveCommunityConfirmModal } from './leaveScenarioModals';

import { useCommunityInfo } from './hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useStories from '~/V4/social/hooks/useStories';

interface CommunityInfoProps {
  communityId: string;
  setStoryFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadingStory: boolean;
}

const CommunityInfo = ({ communityId, setStoryFile, uploadingStory }: CommunityInfoProps) => {
  const { stories } = useStories({
    targetId: communityId,
    targetType: 'community',
  });

  const haveStories = (stories || []).length > 0;
  const isStorySyncing = (stories || [])
    .map((story) => story?.syncState === 'syncing')
    .includes(true);
  const isStoryErrored = (stories || [])
    .map((story) => story?.syncState === 'error')
    .includes(true);

  const { onClickStory, onClickCreateStory } = useNavigation();
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
      onClickStory={onClickStory}
      onClickCreateStory={onClickCreateStory}
      setStoryFile={setStoryFile}
      haveStories={haveStories || false}
      isStorySyncing={isStorySyncing || false}
      isStoryErrored={isStoryErrored || false}
      uploadingStory={uploadingStory}
    />
  );
};

export { UICommunityInfo };
export default CommunityInfo;
