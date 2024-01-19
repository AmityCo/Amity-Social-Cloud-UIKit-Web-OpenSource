import { useMemo } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk';
import useCommunity from '~/social/hooks/useCommunity';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useImage from '~/core/hooks/useImage';
import useCategoriesByIds from '~/social/hooks/useCategoriesByIds';
import useCommunityPermission from '~/social/hooks/useCommunityPermission';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';

export const useCommunityInfo = (communityId?: string) => {
  const { onEditCommunity } = useNavigation();
  const community = useCommunity(communityId);
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
