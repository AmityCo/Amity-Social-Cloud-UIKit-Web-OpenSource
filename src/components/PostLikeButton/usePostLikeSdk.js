import { PostRepository } from 'eko-sdk';
import useLiveObject from 'hooks/useLiveObject';
import { LIKE_REACTION_KEY } from 'constants';

const usePostLikeSdk = ({ postId, onLikeSuccess, onUnlikeSuccess }) => {
  const post = useLiveObject(() => PostRepository.postForId(postId), {});
  const isPostReady = !!post.postId;
  const userHasLikedPost =
    isPostReady && post.myReactions && post.myReactions.includes(LIKE_REACTION_KEY);

  const handleToggleLike = () => {
    if (!userHasLikedPost) {
      PostRepository.addReaction({ postId, reactionName: LIKE_REACTION_KEY });
      onLikeSuccess && onLikeSuccess(postId);
    } else {
      PostRepository.removeReaction({ postId, reactionName: LIKE_REACTION_KEY });
      onUnlikeSuccess && onUnlikeSuccess(postId);
    }
  };

  return {
    handleToggleLike,
    isActive: userHasLikedPost,
    isDisabled: !isPostReady,
  };
};

export default usePostLikeSdk;
