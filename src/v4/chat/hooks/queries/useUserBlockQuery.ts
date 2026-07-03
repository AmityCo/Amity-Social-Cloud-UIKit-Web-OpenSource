import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

type UserBlockPayload = {
  userId: Parameters<typeof UserRepository.Relationship.blockUser>[0];
};

type BlockResponse = Awaited<ReturnType<typeof UserRepository.Relationship.blockUser>>;

type UnblockResponse = Awaited<ReturnType<typeof UserRepository.Relationship.unBlockUser>>;

export function useUserBlockQuery() {
  const { confirm, closeConfirm } = useConfirmContext();
  const { success, error } = useNotifications();

  const blockMutation = useMutation<BlockResponse, Error, UserBlockPayload>({
    mutationFn: ({ userId }) => UserRepository.Relationship.blockUser(userId),
    onSuccess: () => {
      success({ content: resolveString('amity_chat_block_success'), alignment: 'fullscreen' });
    },
    onError: () => {
      error({ content: resolveString('amity_chat_block_failed'), alignment: 'fullscreen' });
    },
  });

  const unblockMutation = useMutation<UnblockResponse, Error, UserBlockPayload>({
    mutationFn: ({ userId }) => UserRepository.Relationship.unBlockUser(userId),
    onSuccess: () => {
      success({ content: resolveString('amity_chat_unblock_success'), alignment: 'fullscreen' });
    },
    onError: () => {
      error({ content: resolveString('amity_chat_unblock_failed'), alignment: 'fullscreen' });
    },
  });

  function block(userId: UserBlockPayload['userId'], displayName: string) {
    confirm({
      title: resolveString('amity_chat_block_confirm_title'),
      content: resolveString('amity_chat_block_confirm_message', displayName),
      okText: resolveString('amity_chat_block_confirm_label'),
      cancelText: resolveString('amity_chat_cancel'),
      okButtonColor: 'alert',
      onOk: async () => {
        await blockMutation.mutateAsync(
          { userId },
          {
            onSuccess: () => closeConfirm(),
            onError: () => closeConfirm(),
          },
        );
      },
      onCancel: () => closeConfirm(),
    });
  }

  function unblock(userId: UserBlockPayload['userId'], displayName: string) {
    confirm({
      title: resolveString('amity_chat_unblock_confirm_title'),
      content: resolveString('amity_chat_unblock_confirm_message', displayName),
      okText: resolveString('amity_chat_unblock_confirm_label'),
      cancelText: resolveString('amity_chat_cancel'),
      okButtonColor: 'primary',
      onOk: async () => {
        await unblockMutation.mutateAsync(
          { userId },
          {
            onSuccess: () => closeConfirm(),
            onError: () => closeConfirm(),
          },
        );
      },
      onCancel: () => closeConfirm(),
    });
  }

  return { block, unblock };
}
