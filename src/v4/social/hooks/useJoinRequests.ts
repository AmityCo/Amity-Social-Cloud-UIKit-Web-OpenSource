import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

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
        content: 'Join request accepted.',
      });
      onApproveSuccess?.();
    },
    onError: (error) => {
      info({
        content: 'Failed to accept join request. Please try again.',
      });
      onApproveError?.(error)
        ? onApproveError?.(error)
        : info({
            content: error.message.includes(ERROR_RESPONSE.DELETED_POST)
              ? 'This join request is no longer available.'
              : 'Failed to accept join request. Please try again.',
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
            content: 'Join request declined.',
          });
    },
    onError: (error) => {
      onDeclineError?.(error)
        ? onDeclineError?.(error)
        : info({
            content: error.message.includes(ERROR_RESPONSE.DELETED_POST)
              ? 'This join request is no longer available.'
              : 'Failed to decline join request. Please try again.',
          });
    },
  });

  return {
    joinRequest,
    approveJoinRequest,
    declineJoinRequest,
  };
};
