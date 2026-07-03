import { useState } from 'react';
import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useString } from '~/v4/core/localization';
import { ERROR_CODE } from '~/v4/chat/constants';

type FlagMessageParam = Parameters<typeof MessageRepository.flagMessage>;

type FlagMessagePayload = Awaited<ReturnType<typeof MessageRepository.flagMessage>>;

type UnflagMessageParam = Parameters<typeof MessageRepository.unflagMessage>[0];

type UnflagMessagePayload = Awaited<ReturnType<typeof MessageRepository.unflagMessage>>;

export type ReportOptions = {
  reason?: Amity.ContentFlagReason;
  onSuccess?: () => void;
};

export type UnreportOptions = {
  onSuccess?: () => void;
};

export type UseFlagMessageQueryParams = {
  messageId: string;
  enabled?: boolean;
  toastAlignment?: 'live-chat' | 'fullscreen' | 'withSidebar';
};

export function useFlagMessageQuery({
  messageId,
  enabled = true,
  toastAlignment,
}: UseFlagMessageQueryParams) {
  const { success, info } = useNotifications();
  const { isDesktop } = useResponsive();
  const [isMessageDeleted, setIsMessageDeleted] = useState(false);
  const reportSuccessToast = useString('amity_chat_toast_message_reported');
  const reportErrorToast = useString('amity_chat_toast_message_reported_error');
  const unreportSuccessToast = useString('amity_chat_toast_un_report_message');
  const unreportErrorToast = useString('amity_chat_toast_un_report_message_error');

  const resolvedToastAlignment = toastAlignment ?? (isDesktop ? 'fullscreen' : 'withSidebar');

  const {
    data: isFlaggedByMe,
    isLoading,
    refetch,
  } = useQuery<boolean>({
    queryKey: ['asc-uikit', 'MessageRepository', 'isMessageFlaggedByMe', messageId],
    queryFn: () => MessageRepository.isMessageFlaggedByMe(messageId),
    enabled: enabled && !!messageId,
  });

  const { mutate: flagMessageMutate, isPending: isPendingReport } = useMutation<
    FlagMessagePayload,
    Error,
    FlagMessageParam
  >({
    mutationFn: (args) => MessageRepository.flagMessage(...args),
    onSuccess: () => {
      refetch();
      success({
        content: reportSuccessToast,
        alignment: resolvedToastAlignment,
      });
    },
    onError: (error) => {
      if (error.message?.includes(ERROR_CODE.NOT_FOUND)) {
        setIsMessageDeleted(true);
        return;
      }
      info({
        content: reportErrorToast,
        alignment: resolvedToastAlignment,
      });
    },
  });

  const { mutate: unflagMessageMutate, isPending: isPendingUnreport } = useMutation<
    UnflagMessagePayload,
    Error,
    UnflagMessageParam
  >({
    mutationFn: MessageRepository.unflagMessage,
    onSuccess: () => {
      refetch();
      success({
        content: unreportSuccessToast,
        alignment: resolvedToastAlignment,
      });
    },
    onError: (error) => {
      if (error.message?.includes(ERROR_CODE.NOT_FOUND)) {
        setIsMessageDeleted(true);
        return;
      }
      info({
        content: unreportErrorToast,
        alignment: resolvedToastAlignment,
      });
    },
  });

  function report(options: ReportOptions = {}) {
    if (!messageId) return;
    const { reason, onSuccess } = options;

    flagMessageMutate([messageId, reason], {
      onSuccess: () => onSuccess?.(),
    });
  }

  function unreport(options: UnreportOptions = {}) {
    if (!messageId) return;
    const { onSuccess } = options;

    unflagMessageMutate(messageId, {
      onSuccess: () => onSuccess?.(),
    });
  }

  return {
    isLoading,
    isFlaggedByMe: isFlaggedByMe ?? false,
    isMessageDeleted,
    isPending: isPendingReport || isPendingUnreport,
    report,
    unreport,
  };
}
