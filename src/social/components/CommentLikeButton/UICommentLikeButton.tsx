import React from 'react';

import StyledCommentLikeButton from './styles';
import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UICommentLikeButtonProps {
  comment?: Amity.Comment | null;
  onLikeSuccess?: (comment: Amity.Comment) => void;
  onUnlikeSuccess?: (comment: Amity.Comment) => void;
}

const UICommentLikeButton = ({
  comment,
  onLikeSuccess,
  onUnlikeSuccess,
}: UICommentLikeButtonProps) => {
  const isLiked = !!(
    comment &&
    comment.myReactions &&
    comment.myReactions.includes(LIKE_REACTION_KEY)
  );
  const totalLikes = comment?.reactions[LIKE_REACTION_KEY] || 0;

  const handleToggleLike = async () => {
    if (comment == null) return;
    try {
      if (!isLiked) {
        await ReactionRepository.addReaction('comment', comment.commentId, LIKE_REACTION_KEY);
        onLikeSuccess?.(comment);
      } else {
        await ReactionRepository.removeReaction('comment', comment.commentId, LIKE_REACTION_KEY);
        onUnlikeSuccess?.(comment);
      }
    } catch (_error) {
      console.error("Can't toggle like", _error);
    }
  };

  return (
    <StyledCommentLikeButton
      isActive={isLiked}
      isDisabled={comment == null}
      totalLikes={totalLikes}
      onClick={handleToggleLike}
    />
  );
};

export default (props: UICommentLikeButtonProps) => {
  const CustomComponentFn = useCustomComponent<UICommentLikeButtonProps>('CommentLikeButton');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICommentLikeButton {...props} />;
};
