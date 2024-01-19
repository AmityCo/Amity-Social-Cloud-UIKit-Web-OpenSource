import { ReactionRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import usePost from './usePost';
import useUserReactionSubscription from './useUserReactionSubscription';
import useCommunitySubscription from './useCommunitySubscription';
import useCommunityReactionSubscription from './useCommunityReactionSubscription';

/**
 *
 * @deprecated call `ReactionRepository.addReaction('post', postId, LIKE_REACTION_KEY)`
 * or `ReactionRepository.removeReaction('post', postId, LIKE_REACTION_KEY)` directly instead
 */
const usePostLike = ({
  postId,
  onLikeSuccess,
  onUnlikeSuccess,
}: {
  postId?: string;
  onLikeSuccess: () => void;
  onUnlikeSuccess: () => void;
}) => {
  const post = usePost(postId);

  useUserReactionSubscription({
    userId: post?.targetId,
    shouldSubscribe: () => post?.targetType === 'user',
  });

  useCommunityReactionSubscription({
    communityId: post?.targetId,
    shouldSubscribe: () => post?.targetType === 'community',
  });

  const handleLike = async () => {
    try {
      if (!post) return;
      await ReactionRepository.addReaction('post', post.postId, LIKE_REACTION_KEY);
      onLikeSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async () => {
    try {
      if (!post) return;
      await ReactionRepository.removeReaction('post', post.postId, LIKE_REACTION_KEY);
      onUnlikeSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    post,
    handleLike,
    handleUnlike,
  };
};

export default usePostLike;
