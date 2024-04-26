import { PostRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import useSDK from '~/core/hooks/useSDK';

const usePostFlaggedByMe = (post?: Amity.Post) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);
  const { currentUserId } = useSDK();
  const postId = post?.postId || undefined;
  const isUnableToFlag = useMemo(() => post?.creatorId === currentUserId, [post, currentUserId]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
    queryFn: () => {
      return PostRepository.isPostFlaggedByMe(postId);
    },
    enabled: post != null,
  });

  useEffect(() => {
    if (data != null) {
      setIsFlaggedByMe(data);
    }
  }, [data]);

  const flagPost = async () => {
    if (postId == null || isUnableToFlag) return;
    try {
      await PostRepository.flagPost(postId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    } finally {
      refetch();
    }
  };

  const unflagPost = async () => {
    if (postId == null || isUnableToFlag) return;
    try {
      await PostRepository.unflagPost(postId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    } finally {
      refetch();
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
