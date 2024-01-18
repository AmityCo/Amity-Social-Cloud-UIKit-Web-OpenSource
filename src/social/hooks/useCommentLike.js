import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import useComment from './useComment';

/**
 *
 * @deprecated call `ReactionRepository.addReaction('comment', commentId, LIKE_REACTION_KEY)`
 * or `ReactionRepository.removeReaction('comment', commentId, LIKE_REACTION_KEY)` directly instead
 */
const useCommentLike = ({ commentId, onLikeSuccess, onUnlikeSuccess }) => {
  const comment = useComment(commentId);
  const isCommentReady = !!comment.commentId;
  const userHasLikedComment =
    isCommentReady && comment.myReactions && comment.myReactions.includes(LIKE_REACTION_KEY);

  const handleToggleLike = async () => {
    if (!userHasLikedComment) {
      await ReactionRepository.addReaction('comment', commentId, LIKE_REACTION_KEY);
      onLikeSuccess && onLikeSuccess(commentId);
    } else {
      await ReactionRepository.removeReaction('comment', commentId, LIKE_REACTION_KEY);
      onUnlikeSuccess && onUnlikeSuccess(commentId);
    }
  };

  const getTotalLikes = () => {
    if (!isCommentReady) return 0;
    return comment.reactions[LIKE_REACTION_KEY];
  };

  return {
    handleToggleLike,
    isActive: userHasLikedComment,
    disabled: !isCommentReady,
    totalLikes: getTotalLikes(),
  };
};

export default useCommentLike;
