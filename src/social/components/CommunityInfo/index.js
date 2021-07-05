import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ImageSize, FileRepository, FeedType, PostTargetType } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';
import useCommunity from '~/social/hooks/useCommunity';
import useFeed from '~/social/hooks/useFeed';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UICommunityInfo from './UICommunityInfo';
import { confirm } from '~/core/components/Confirm';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

function usePendingPostCount(isReady, community, canReviewCommunityPosts) {
  // TODO workaround
  // community.reviewingFeed?.postCount has the same number for all users
  const [posts] = useFeed({
    targetType: isReady && !canReviewCommunityPosts ? PostTargetType.CommunityFeed : '',
    targetId: community.communityId,
    feedType: FeedType.Reviewing,
  });

  return canReviewCommunityPosts ? community.reviewingFeed?.postCount ?? 0 : posts.length;
}

const CommunityInfo = ({ communityId, currentUserId }) => {
  const { onEditCommunity } = useNavigation();
  const { community, communityCategories, joinCommunity, leaveCommunity } = useCommunity(
    communityId,
  );
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

  const { formatMessage } = useIntl();

  const leaveCommunityConfirm = () =>
    confirm({
      title: formatMessage({ id: 'community.leaveCommunityTitle' }),
      content: formatMessage({ id: 'community.leaveCommunityBody' }),
      okText: formatMessage({ id: 'community.leaveCommunityButtonText' }),
      onOk: () => leaveCommunity(community.communityId),
    });

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
    community,
    canReviewCommunityPosts,
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
      canEditCommunity={canEditCommunity}
      onEditCommunity={onEditCommunity}
      joinCommunity={joinCommunity}
      leaveCommunity={leaveCommunityConfirm}
      canLeaveCommunity={canLeaveCommunity}
      canReviewPosts={canReviewCommunityPosts}
      name={community.displayName}
      needApprovalOnPostCreation={community.needApprovalOnPostCreation}
    />
  );
};

export { UICommunityInfo };
export default memo(withSDK(CommunityInfo));
