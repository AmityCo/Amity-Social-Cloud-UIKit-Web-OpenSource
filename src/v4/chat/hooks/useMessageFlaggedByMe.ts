import { useState } from 'react';
import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export const useMessageFlaggedByMe = ({
  messageId,
  reasonReport,
  onCloseMenu,
}: {
  messageId: string;
  reasonReport?: Amity.ContentFlagReason;
  onCloseMenu?: () => void;
}): {
  isLoading: boolean;
  isFlaggedByMe: boolean;
  isMessageDeleted: boolean;
  isFlagLoading: boolean;
  mutateReportMessage: () => Promise<unknown>;
  mutateUnreportMessage: () => Promise<unknown>;
} => {
  const { success, info } = useNotifications();
  const queryClient = useQueryClient();
  const [isMessageDeleted, setIsMessageDeleted] = useState(false);
  const { isDesktop } = useResponsive();
  const queryKey = ['asc-uikit', 'MessageRepository', 'isMessageFlaggedByMe', messageId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      return MessageRepository.isMessageFlaggedByMe(messageId);
    },
    enabled: messageId != null,
  });

  const { mutateAsync: mutateReportMessage, isPending: isFlagLoading } = useMutation({
    mutationFn: async () => {
      if (messageId == null) return;
      return MessageRepository.flagMessage(messageId, reasonReport);
    },
    onSuccess: () => {
      success({
        content: 'Message reported.',
      });
      onCloseMenu?.();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey,
      });

      queryClient.setQueryData(queryKey, () => true);
    },
    onError: (error) => {
      if (error.message?.includes('400400')) {
        setIsMessageDeleted(true);
      } else {
        info({
          content: `Failed to report message. Please try again.`,
          alignment: isDesktop ? 'fullscreen' : 'withSidebar',
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const { mutateAsync: mutateUnreportMessage } = useMutation({
    mutationFn: async () => {
      if (messageId == null) return;
      return MessageRepository.unflagMessage(messageId);
    },
    onSuccess: () => {
      success({
        content: `Message unreported.`,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey,
      });

      queryClient.setQueryData(queryKey, () => false);
    },
    onError: () => {
      info({
        content: `Failed to unreport Message. Please try again.`,
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
      onCloseMenu?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return {
    isLoading,
    isFlaggedByMe: data || false,
    isMessageDeleted,
    isFlagLoading,
    mutateReportMessage,
    mutateUnreportMessage,
  };
};
