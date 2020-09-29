import { CommentRepository } from 'eko-sdk';
import { LIKE_REACTION_KEY } from 'constants';
import useLiveObject from '~/core/hooks/useLiveObject';

const commentRepo = new CommentRepository();

const useCommentLikeSdk = ({ commentId, onLikeSuccess, onUnlikeSuccess }) => {
  const comment = useLiveObject(() => commentRepo.commentForId(commentId), [commentId]);
  const isCommentReady = !!comment.commentId;
  const userHasLikedComment =
    isCommentReady && comment.myReactions && comment.myReactions.includes(LIKE_REACTION_KEY);

  const handleToggleLike = () => {
    if (!userHasLikedComment) {
      commentRepo.addReaction({ commentId, reactionName: LIKE_REACTION_KEY });
      onLikeSuccess && onLikeSuccess(commentId);
    } else {
      commentRepo.removeReaction({ commentId, reactionName: LIKE_REACTION_KEY });
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

export default useCommentLikeSdk;
