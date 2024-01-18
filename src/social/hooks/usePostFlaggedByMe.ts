import { PostRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useState } from 'react';
import useSDK from '~/core/hooks/useSDK';

const usePostFlaggedByMe = (post?: Amity.Post) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);
  const { currentUserId } = useSDK();

  const postId = post?.postId || undefined;

  const isUnableToFlag = useMemo(() => post?.creatorId === currentUserId, [post, currentUserId]);

  useEffect(() => {
    if (!postId || isUnableToFlag) return;
    PostRepository.isPostFlaggedByMe(postId).then((value) => {
      setIsFlaggedByMe(value);
      setIsLoading(false);
    });
  }, [postId]);

  const flagPost = async () => {
    if (postId == null || isUnableToFlag) return;
    try {
      setIsFlaggedByMe(true);
      await PostRepository.flagPost(postId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    }
  };

  const unflagPost = async () => {
    if (postId == null || isUnableToFlag) return;
    try {
      setIsFlaggedByMe(false);
      await PostRepository.unflagPost(postId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    }
  };

  const toggleFlagPost = async () => {
    if (postId == null || isUnableToFlag) return;
    if (isFlaggedByMe) {
      unflagPost();
    } else {
      flagPost();
    }
  };

  return {
    isLoading,
    isFlaggedByMe,
    isUnableToFlag,
    flagPost,
    unflagPost,
    toggleFlagPost,
  };
};

export default usePostFlaggedByMe;
