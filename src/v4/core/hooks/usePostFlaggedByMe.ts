import { PostRepository } from '@amityco/ts-sdk';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import useSDK from './useSDK';

export const usePostFlaggedByMe = ({
  post,
  reasonReport,
  isFlaggable,
  onReportSuccess,
  onReportError,
  onUnreportSuccess,
  onUnreportError,
}: {
  post?: Amity.Post;
  reasonReport?: Amity.ContentFlagReason;
  isFlaggable: boolean;
  onReportSuccess?: () => void;
  onReportError?: (error: Error) => void;
  onUnreportSuccess?: () => void;
  onUnreportError?: (error: Error) => void;
}): {
  isPending: boolean;
  isLoading: boolean;
  isFlaggedByMe: boolean;
  mutateReportPost: UseMutateAsyncFunction<boolean, Error, void, void>;
  mutateUnReportPost: UseMutateAsyncFunction<boolean, Error, void, void>;
} => {
  const { isVisitorOrBot } = useSDK();
  const queryClient = useQueryClient();
  const postId = post?.postId || undefined;

  const { data, isLoading } = useQuery({
    networkMode: 'always',
    queryKey: ['asc-uikit', 'PostRepository', 'isPostFlaggedByMe', postId],
    queryFn: () => {
      return PostRepository.isPostFlaggedByMe(postId!);
    },
    enabled: postId != null && isFlaggable && !isVisitorOrBot,
  });

  const { mutateAsync: mutateReportPost, isPending } = useMutation({
    networkMode: 'always',
    mutationFn: async () => {
      return PostRepository.flagPost(post?.postId ?? '', reasonReport);
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
    networkMode: 'always',
    mutationFn: async () => {
      return PostRepository.unflagPost(post?.postId ?? '');
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
    isFlaggedByMe: data || false,
    mutateReportPost,
    mutateUnReportPost,
    isPending,
  };
};
