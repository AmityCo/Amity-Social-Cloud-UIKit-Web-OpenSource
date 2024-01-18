import React, { useEffect, useMemo, useState } from 'react';

import UILikeButton from './UILikeButton';
import usePost from '~/social/hooks/usePost';
import { LIKE_REACTION_KEY } from '~/constants';
import { ReactionRepository } from '@amityco/ts-sdk';

interface PostLikeButtonProps {
  postId: string;
  onLikeSuccess?: (post: Amity.Post) => void;
  onUnlikeSuccess?: (post: Amity.Post) => void;
}

function isPostLikedByMe(post?: Amity.Post) {
  if (post == null || post.myReactions?.length === 0) return false;
  return post?.myReactions?.includes(LIKE_REACTION_KEY);
}

const PostLikeButton = ({ postId, onLikeSuccess, onUnlikeSuccess }: PostLikeButtonProps) => {
  const post: Amity.Post = usePost(postId);
  const [isActive, setIsActive] = useState(isPostLikedByMe(post));
  useEffect(() => {
    setIsActive(isPostLikedByMe(post));
  }, [post?.myReactions]);

  const handleToggleLike = async () => {
    if (post == null) return;
    if (!isActive) {
      await ReactionRepository.addReaction('post', post.postId, LIKE_REACTION_KEY);
      onLikeSuccess?.(post);
      setIsActive(!isActive);
    } else {
      await ReactionRepository.removeReaction('post', post.postId, LIKE_REACTION_KEY);
      onUnlikeSuccess?.(post);
      setIsActive(!isActive);
    }
  };

  return <UILikeButton isActive={isActive} isDisabled={post == null} onClick={handleToggleLike} />;
};

export default PostLikeButton;
