import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type useJoinRequestsProps = {
  onApproveSuccess?: () => void;
  onApproveError?: (error: Error) => void;
};

export const useJoinRequests = ({ onApproveSuccess, onApproveError }: useJoinRequestsProps = {}): {
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
      onApproveError?.(error);
    },
  });

  const { mutate: declineJoinRequest } = useMutation({
    mutationFn: async (joinRequest: Amity.JoinRequest) => await joinRequest.reject(),
    onSuccess: (data: any) => {
      setJoinRequest(data);
      success({
        content: 'Join request declined.',
      });
      onApproveSuccess?.();
    },
    onError: (error) => {
      info({
        content: 'Failed to decline join request. Please try again.',
      });
      onApproveError?.(error);
    },
  });

  return {
    joinRequest,
    approveJoinRequest,
    declineJoinRequest,
  };
};
