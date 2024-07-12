import { useMemo } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk';
import useCommunityPermission from '~/social/hooks/useCommunityPermission';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';
import { useImage } from '~/v4/core/hooks/useImage';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export const useCommunityInfo = (communityId?: string) => {
  const { onEditCommunity } = useNavigation();
  const { community } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });
  const avatarFileUrl = useImage({ fileId: community?.avatarFileId, imageSize: 'medium' });

  const { posts: reviewingPosts } = usePostsCollection({
    targetType: 'community',
    targetId: communityId,
    feedType: 'reviewing',
  });

  const categories = useCategoriesByIds(community?.categoryIds);

  const { canReview, canEdit } = useCommunityPermission({ community });

  const pendingPostsCount = useMemo(() => {
    return reviewingPosts?.length || 0;
  }, [reviewingPosts]);

  type updateCommunityFnType = typeof CommunityRepository.updateCommunity;

  const updateCommunity = (payload: Parameters<updateCommunityFnType>[1]) =>
    communityId && CommunityRepository.updateCommunity(communityId, payload);

  const joinCommunity = () => communityId && CommunityRepository.joinCommunity(communityId);
  const leaveCommunity = () => communityId && CommunityRepository.leaveCommunity(communityId);
  const closeCommunity = () => communityId && CommunityRepository.deleteCommunity(communityId);

  return {
    community,
    reviewingPosts,
    avatarFileUrl,
    communityCategories: categories,
    pendingPostsCount,
    canEditCommunity: canEdit,
    canReviewCommunityPosts: canReview,
    onEditCommunity,
    joinCommunity,
    leaveCommunity,
    updateCommunity,
    closeCommunity,
  };
};
