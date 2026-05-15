import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { resolveString } from '~/v4/core/localization';

const useUserBlock = () => {
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { mutateAsync: blockUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.blockUser>[0]) => {
      return UserRepository.Relationship.blockUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: resolveString('amity_social_button_user_blocked'),
      });
    },
    onError: () => {
      notification.error({
        content: resolveString('amity_social_toast_user_block_failed'),
      });
    },
  });

  const { mutateAsync: unblockUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.unBlockUser>[0]) => {
      return UserRepository.Relationship.unBlockUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: resolveString('amity_social_button_user_unblocked'),
      });
    },
    onError: () => {
      notification.error({
        content: resolveString('amity_social_toast_user_unblock_failed'),
      });
    },
  });

  const block = ({
    pageId,
    componentId,
    userId,
    displayName,
  }: {
    pageId?: string;
    componentId?: string;
    userId: string;
    displayName: string;
  }) => {
    confirm({
      pageId,
      componentId,
      title: resolveString('amity_social_modal_dialog_title_block_user'),
      content: resolveString('amity_social_label_user_block_message_format', displayName),
      cancelText: resolveString('amity_social_button_cancel'),
      okText: resolveString('amity_social_button_block'),
      onOk: async () => {
        if (!navigator.onLine) {
          notification.error({
            content: resolveString('amity_social_toast_user_block_failed'),
          });
          throw new Error(resolveString('amity_social_label_no_internet_connection'));
        }
        await blockUser(userId);
      },
    });
  };

  const unblock = ({
    pageId,
    componentId,
    userId,
    displayName,
  }: {
    pageId?: string;
    componentId?: string;
    userId: string;
    displayName: string;
  }) => {
    confirm({
      pageId,
      componentId,
      title: resolveString('amity_social_modal_dialog_title_unblock_user'),
      content: resolveString('amity_social_modal_dialog_unblock_user_description'),
      cancelText: resolveString('amity_social_button_cancel'),
      okText: resolveString('amity_social_button_unblock'),
      onOk: async () => {
        if (!navigator.onLine) {
          notification.error({
            content: resolveString('amity_social_toast_user_unblock_failed'),
          });
          throw new Error(resolveString('amity_social_label_no_internet_connection'));
        }
        await unblockUser(userId);
      },
    });
  };

  return {
    blockUser: block,
    unblockUser: unblock,
  };
};

export default useUserBlock;
