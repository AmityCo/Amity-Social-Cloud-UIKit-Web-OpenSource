import { useMutation } from '@tanstack/react-query';
import { InvitationRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { resolveString } from '~/v4/core/localization';

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
      okText: resolveString('amity_social_button_confirm'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_cancel_co_host_invitation'),
      pageId,
      content: resolveString('amity_social_modal_alert_cancel_cohost_invitation_message'),
    });
  };

  return {
    cancelInvitation,
    isPending,
  };
};
