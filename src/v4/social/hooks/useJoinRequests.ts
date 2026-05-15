import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { resolveString } from '~/v4/core/localization';

type useJoinRequestsProps = {
  onApproveSuccess?: () => void;
  onApproveError?: (error: Error) => void;
  onDeclineSuccess?: () => void;
  onDeclineError?: (error: Error) => void;
};

export const useJoinRequests = ({
  onApproveSuccess,
  onApproveError,
  onDeclineSuccess,
  onDeclineError,
}: useJoinRequestsProps = {}): {
  joinRequest?: Amity.JoinRequest;
  approveJoinRequest: (joinRequest: Amity.JoinRequest) => void;
  declineJoinRequest: (joinRequest: Amity.JoinRequest) => void;
} => {
  const { success, info } = useNotifications();
  const [joinRequest, setJoinRequest] = useState<Amity.JoinRequest | undefined>(undefined);

  const { mutate: approveJoinRequest } = useMutation({
    mutationFn: async (joinRequest: Amity.JoinRequest) => await joinRequest.approve(),
    onSuccess: (data: any) => {
      setJoinRequest(data);
      success({
        content: resolveString('amity_social_label_join_request_accepted'),
      });
      onApproveSuccess?.();
    },
    onError: (error) => {
      info({
        content: resolveString('amity_social_toast_accept_join_request_failed'),
      });
      onApproveError?.(error)
        ? onApproveError?.(error)
        : info({
            content: error.message.includes(ERROR_RESPONSE.DELETED_POST)
              ? resolveString('amity_social_label_join_request_unavailable')
              : resolveString('amity_social_toast_accept_join_request_failed'),
          });
    },
  });

  const { mutate: declineJoinRequest } = useMutation({
    mutationFn: async (joinRequest: Amity.JoinRequest) => await joinRequest.reject(),
    onSuccess: (data: any) => {
      setJoinRequest(data);
      onDeclineSuccess?.()
        ? onDeclineSuccess?.()
        : success({
            content: resolveString('amity_social_label_join_request_declined'),
          });
    },
    onError: (error) => {
      onDeclineError?.(error)
        ? onDeclineError?.(error)
        : info({
            content: error.message.includes(ERROR_RESPONSE.DELETED_POST)
              ? resolveString('amity_social_label_join_request_unavailable')
              : resolveString('amity_social_toast_decline_join_request_failed'),
          });
    },
  });

  return {
    joinRequest,
    approveJoinRequest,
    declineJoinRequest,
  };
};
