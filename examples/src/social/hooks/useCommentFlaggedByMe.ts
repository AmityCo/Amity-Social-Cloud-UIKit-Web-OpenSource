import { CommentRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useCommentFlaggedByMe = (commentId?: string) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
    queryFn: () => {
      return CommentRepository.isCommentFlaggedByMe(commentId as string);
    },
    enabled: commentId != null,
  });

  useEffect(() => {
    if (data != null) {
      setIsFlaggedByMe(data);
    }
  }, [data]);

  const flagComment = async () => {
    if (commentId == null) return;
    try {
      setIsFlaggedByMe(true);
      await CommentRepository.flagComment(commentId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    } finally {
      refetch();
    }
  };

  const unflagComment = async () => {
    if (commentId == null) return;
    try {
      setIsFlaggedByMe(false);
      await CommentRepository.unflagComment(commentId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    } finally {
      refetch();
    }
  };

  const toggleFlagComment = async () => {
    if (commentId == null) return;
    if (isFlaggedByMe) {
      unflagComment();
    } else {
      flagComment();
    }
  };

  return {
    isLoading,
    isFlaggedByMe,
    flagComment,
    unflagComment,
    toggleFlagComment,
  };
};

export default useCommentFlaggedByMe;
