import { useMutation } from '@tanstack/react-query';
import { resolveString } from '~/v4/core/localization';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export interface UseCreateInvitationProps {
  room?: Amity.Room | null;
  pageId?: string;
}

export interface UseCreateInvitationReturn {
  createInvitation: (userId: string) => void;
  handleCreateInvitation: (
    userId: string,
    options?: { displayName?: string; onSuccess?: () => void; onError?: () => void },
  ) => void;
  isPending: boolean;
}

export const useCreateInvitation = ({
  room,
  pageId = '*',
}: UseCreateInvitationProps): UseCreateInvitationReturn => {
  const { confirm } = useConfirmContext();
  const { success } = useNotifications();

  const { mutate: createInvitation, isPending } = useMutation({
    mutationFn: async (userId: string) => room?.createInvitation(userId),
  });

  const handleCreateInvitation = (
    userId: string,
    options?: { displayName?: string; onSuccess?: () => void; onError?: () => void },
  ) => {
    const name = options?.displayName || userId;
    confirm({
      type: 'confirm',
      okButtonColor: 'primary',
      onOk: () => {
        createInvitation(userId, {
          onSuccess: () => options?.onSuccess?.(),
          onError: () => options?.onError?.(),
        });
        success({ content: resolveString('amity_social_button_invitation_sent') });
      },
      okText: resolveString('amity_social_button_invite'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_confirm_invite_co_host'),
      pageId,
      content: resolveString('amity_social_modal_dialog_cohost_invitation_description', name),
    });
  };

  return {
    createInvitation,
    handleCreateInvitation,
    isPending,
  };
};
