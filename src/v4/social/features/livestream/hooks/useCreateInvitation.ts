import { useMutation } from '@tanstack/react-query';
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
    options?: { onSuccess?: () => void; onError?: () => void },
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
    options?: { onSuccess?: () => void; onError?: () => void },
  ) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'primary',
      onOk: () => {
        createInvitation(userId, {
          onSuccess: () => options?.onSuccess?.(),
          onError: () => options?.onError?.(),
        });
        success({ content: 'Invitation sent.' });
      },
      okText: 'Invite',
      cancelText: 'Cancel',
      title: 'Confirm invite co-host',
      pageId,
      content:
        "If they accept your invitation, they'll join as a co-host with moderator access. They can turn on their camera and mic, appear on stage, and help manage chat.",
    });
  };

  return {
    createInvitation,
    handleCreateInvitation,
    isPending,
  };
};
