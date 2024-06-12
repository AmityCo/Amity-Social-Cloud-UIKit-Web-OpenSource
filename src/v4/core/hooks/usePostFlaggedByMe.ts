import { PostRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const usePostFlaggedByMe = ({
  post,
  isFlaggable,
  onReportSuccess,
  onReportError,
  onUnreportSuccess,
  onUnreportError,
}: {
  post?: Amity.Post;
  isFlaggable: boolean;
  onReportSuccess?: () => void;
  onReportError?: (error: Error) => void;
  onUnreportSuccess?: () => void;
  onUnreportError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const postId = post?.postId || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
    queryFn: () => {
      return PostRepository.isPostFlaggedByMe(postId);
    },
    enabled: postId != null && isFlaggable,
  });

  const { mutateAsync: mutateReportPost } = useMutation({
    mutationFn: async () => {
      return PostRepository.flagPost(post.postId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });

      queryClient.setQueryData(
        ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
        () => true,
      );
    },
    onSuccess: () => {
      onReportSuccess?.();
    },
    onError: (err, newTodo, context) => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });
      onReportError?.(err);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });
    },
  });

  const { mutateAsync: mutateUnReportPost } = useMutation({
    mutationFn: async () => {
      return PostRepository.unflagPost(post.postId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });

      queryClient.setQueryData(
        ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
        () => false,
      );
    },
    onSuccess: () => {
      onUnreportSuccess?.();
    },
    onError: (err, newTodo, context) => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });
      onUnreportError?.(err);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
      });
    },
  });

  return {
    isLoading,
    isFlaggedByMe: data,
    mutateReportPost,
    mutateUnReportPost,
  };
};
