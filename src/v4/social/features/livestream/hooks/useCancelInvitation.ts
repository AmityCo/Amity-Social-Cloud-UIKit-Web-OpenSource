import { useMutation } from '@tanstack/react-query';
import { InvitationRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export interface UseCancelInvitationProps {
  pageId?: string;
}

export interface UseCancelInvitationReturn {
  cancelInvitation: (
    invitationId: string,
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => void;
  isPending: boolean;
}

export const useCancelInvitation = ({
  pageId = '*',
}: UseCancelInvitationProps): UseCancelInvitationReturn => {
  const { confirm } = useConfirmContext();

  const { mutate, isPending } = useMutation({
    mutationFn: async (invitationId: string) => InvitationRepository.cancelInvitation(invitationId),
  });

  const cancelInvitation = (
    invitationId: string,
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'primary',
      onOk: () =>
        mutate(invitationId, {
          onSuccess: () => options?.onSuccess?.(),
          onError: () => options?.onError?.(),
        }),
      okText: 'Confirm',
      cancelText: 'Cancel',
      title: 'Cancel co-host invitation',
      pageId,
      content:
        "Are you sure you want to cancel this invitation? They'll no longer be invited as a co-host and will remain as a viewer.",
    });
  };

  return {
    cancelInvitation,
    isPending,
  };
};
