import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type UseUserFollowReturnType = {
  followUser: (
    params: Parameters<typeof UserRepository.Relationship.follow>[0],
  ) => Promise<Amity.Cached<Amity.RawFollowStatus>>;
  unFollowUser: (params: { pageId?: string; userId: string }) => void;
  cancelFollow: (userId: string) => Promise<boolean>;
};

const useUserFollow = (): UseUserFollowReturnType => {
  const { confirm, closeConfirm } = useConfirmContext();
  const notification = useNotifications();

  const { mutateAsync: followUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.follow>[0]) => {
      return UserRepository.Relationship.follow(params);
    },
    onError: () => {
      confirm({
        title: 'Unable to follow this user',
        content: 'Oops! something went wrong. Please try again later.',
        onOk: () => closeConfirm(),
      });
    },
  });

  const { mutateAsync: unFollowUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.Relationship.unfollow>[0]) => {
      return UserRepository.Relationship.unfollow(params);
    },
    onError: () => {
      notification.error({
        content: 'Failed to unfollow user.',
      });
    },
  });

  const unFollow = ({ pageId, userId }: { pageId?: string; userId: string }) => {
    confirm({
      pageId,
      type: 'info',
      title: 'Unfollow this user?',
      content: 'If you change your mind, you’ll have to request to follow them again.',
      onOk: () => unFollowUser(userId),
    });
  };

  return {
    followUser,
    unFollowUser: unFollow,
    cancelFollow: unFollowUser,
  };
};

export default useUserFollow;
