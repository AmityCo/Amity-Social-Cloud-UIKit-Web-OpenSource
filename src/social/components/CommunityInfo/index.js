import React, { memo, useMemo, useEffect } from 'react';
import { ImageSize, FileRepository, FeedType, PostTargetType } from '@amityco/js-sdk';
import withSDK from '~/core/hocs/withSDK';
import useCommunity from '~/social/hooks/useCommunity';
import useFeed from '~/social/hooks/useFeed';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
import UICommunityInfo from './UICommunityInfo';
import { leaveCommunityConfirmModal } from './leaveScenarioModals';

function usePendingPostCount(
  isReady,
  communityId,
  community,
  canReviewCommunityPosts,
  pendingPostsCount = 0,
) {
  // TODO workaround
  // community.reviewingFeed?.postCount has the same number for all users
  const [posts] = useFeed({
    targetType: isReady && !canReviewCommunityPosts ? PostTargetType.CommunityFeed : '',
    targetId: communityId,
    feedType: FeedType.Reviewing,
    limit: 10,
    dependencies: [pendingPostsCount],
  });

  return canReviewCommunityPosts ? community?.reviewingFeed?.postCount ?? 0 : posts.length;
}

const CommunityInfo = ({ communityId, currentUserId }) => {
  const { onEditCommunity } = useNavigation();
  const { community, communityCategories, joinCommunity, leaveCommunity } =
    useCommunity(communityId);
  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [community.avatarFileId],
  );

  const { membersCount, description, isJoined, userId: communityOwnerId } = community;
  const { isCurrentMemberReady, canEditCommunity, canReviewCommunityPosts } = useCommunityOneMember(
    communityId,
    currentUserId,
    communityOwnerId,
  );

  const canLeaveCommunity = isJoined;
  const categoryNames = communityCategories.map(({ name }) => name);

  const pendingPostsCount = usePendingPostCount(
    isCurrentMemberReady,
    communityId,
    community,
    canReviewCommunityPosts,
    community?.reviewingFeed?.postCount ?? 0,
  );

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={categoryNames}
      pendingPostsCount={pendingPostsCount}
      postsCount={community.publishedFeed?.postCount ?? 0}
      membersCount={membersCount}
      description={description}
      isJoined={isJoined}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      avatarFileUrl={fileUrl}
      joinCommunity={joinCommunity}
      canEditCommunity={canEditCommunity}
      canLeaveCommunity={canLeaveCommunity}
      canReviewPosts={canReviewCommunityPosts}
      name={community.displayName}
      postSetting={community.postSetting}
      onEditCommunity={onEditCommunity}
      onClickLeaveCommunity={() => leaveCommunityConfirmModal(communityId, leaveCommunity)}
    />
  );
};

export { UICommunityInfo };
export default memo(withSDK(CommunityInfo));
