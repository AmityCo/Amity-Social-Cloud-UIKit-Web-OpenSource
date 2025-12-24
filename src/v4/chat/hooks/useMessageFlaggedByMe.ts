import { useState } from 'react';
import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export const useMessageFlaggedByMe = ({
  messageId,
  onCloseMenu,
  type = 'chat',
}: {
  messageId: string;
  onCloseMenu?: () => void;
  type?: 'live-chat' | 'chat';
}): {
  isLoading: boolean;
  isFlaggedByMe: boolean;
  isMessageDeleted: boolean;
  isPending: boolean;
  mutateReportMessage: (reasonReport?: Amity.ContentFlagReason) => Promise<unknown>;
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

  const { mutateAsync: mutateReportMessage, isPending: isPendingReport } = useMutation({
    mutationFn: async (reasonReport?: Amity.ContentFlagReason) => {
      if (messageId == null) return;
      return MessageRepository.flagMessage(messageId, reasonReport);
    },
    onSuccess: () => {
      success({
        content: 'Message reported.',
        alignment: type === 'live-chat' ? 'live-chat' : isDesktop ? 'fullscreen' : 'withSidebar',
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
          alignment: type === 'live-chat' ? 'live-chat' : isDesktop ? 'fullscreen' : 'withSidebar',
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const { mutateAsync: mutateUnreportMessage, isPending: isPendingUnreport } = useMutation({
    mutationFn: async () => {
      if (messageId == null) return;
      return MessageRepository.unflagMessage(messageId);
    },
    onSuccess: () => {
      success({
        content: `Message unreported.`,
        alignment: type === 'live-chat' ? 'live-chat' : isDesktop ? 'fullscreen' : 'withSidebar',
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
        alignment: type === 'live-chat' ? 'live-chat' : isDesktop ? 'fullscreen' : 'withSidebar',
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
    isPending: isPendingReport || isPendingUnreport,
    mutateReportMessage,
    mutateUnreportMessage,
  };
};
