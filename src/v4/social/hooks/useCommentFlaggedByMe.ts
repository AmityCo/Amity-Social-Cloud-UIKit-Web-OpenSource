import { useState } from 'react';
import { CommentRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export const useCommentFlaggedByMe = ({
  commentId,
  reasonReport,
  onCloseMenu,
  isReplyComment,
}: {
  commentId: string;
  reasonReport?: Amity.ContentFlagReason;
  onCloseMenu?: () => void;
  isReplyComment?: boolean;
}): {
  isLoading: boolean;
  isFlaggedByMe: boolean;
  isCommentDeleted: boolean;
  isFlagLoading: boolean;
  mutateReportComment: () => Promise<unknown>;
  mutateUnreportComment: () => Promise<unknown>;
} => {
  const { success, info } = useNotifications();
  const queryClient = useQueryClient();
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const { isDesktop } = useResponsive();

  const { data, isLoading } = useQuery({
    queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
    queryFn: () => {
      return CommentRepository.isCommentFlaggedByMe(commentId as string);
    },
    enabled: commentId != null,
  });

  const { mutateAsync: mutateReportComment, isPending: isFlagLoading } = useMutation({
    mutationFn: async () => {
      if (commentId == null) return;
      return CommentRepository.flagComment(commentId, reasonReport);
    },
    onSuccess: () => {
      success({
        content: `${isReplyComment ? 'Reply' : 'Comment'} reported.`,
      });
      onCloseMenu?.();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
      });

      queryClient.setQueryData(
        ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
        () => true,
      );
    },
    onError: (error) => {
      if (error.message?.includes('400400')) {
        setIsCommentDeleted(true);
      } else {
        info({
          content: `Failed to report ${isReplyComment ? 'reply' : 'comment'}. Please try again.`,
          alignment: isDesktop ? 'fullscreen' : 'withSidebar',
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
      });
    },
  });

  const { mutateAsync: mutateUnreportComment } = useMutation({
    mutationFn: async () => {
      if (commentId == null) return;
      return CommentRepository.unflagComment(commentId);
    },
    onSuccess: () => {
      success({
        content: `${isReplyComment ? 'Reply' : 'Comment'} unreported.`,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
      });

      queryClient.setQueryData(
        ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
        () => false,
      );
    },
    onError: () => {
      info({
        content: `Failed to unreport ${isReplyComment ? 'reply' : 'comment'}. Please try again.`,
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
      onCloseMenu?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['asc-uikit', 'CommentRepository', 'isCommentFlaggedByMe', commentId],
      });
    },
  });

  return {
    isLoading,
    isFlaggedByMe: data || false,
    isCommentDeleted,
    isFlagLoading,
    mutateReportComment,
    mutateUnreportComment,
  };
};
