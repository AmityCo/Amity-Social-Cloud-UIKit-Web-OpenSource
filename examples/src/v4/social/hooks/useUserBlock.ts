import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

const useUserBlock = () => {
  const { confirm } = useConfirmContext();
  const notification = useNotifications();
  const { mutateAsync: blockUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.blockUser>[0]) => {
      return UserRepository.Relationship.blockUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: 'User blocked.',
      });
    },
    onError: () => {
      notification.error({
        content: 'Failed to block user. Please try again.',
      });
    },
  });

  const { mutateAsync: unblockUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.unBlockUser>[0]) => {
      return UserRepository.Relationship.unBlockUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: 'User unblocked.',
      });
    },
    onError: () => {
      notification.error({
        content: 'Failed to unblock user. Please try again.',
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
      title: 'Block user?',
      content: `${displayName} won’t be able to see posts and comments that you’ve created. They won’t be notified that you’ve blocked them.`,
      cancelText: 'Cancel',
      okText: 'Block',
      onOk: () => blockUser(userId),
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
      title: 'Unblock user?',
      content: `${displayName} will now be able to see posts and comments that you’ve created. They won’t be notified that you’ve unblocked them.`,
      cancelText: 'Cancel',
      okText: 'Unblock',
      onOk: () => unblockUser(userId),
    });
  };

  return {
    blockUser: block,
    unblockUser: unblock,
  };
};

export default useUserBlock;
