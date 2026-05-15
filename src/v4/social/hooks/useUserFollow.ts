import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { resolveString } from '~/v4/core/localization';

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
        title: resolveString('amity_social_modal_dialog_title_unable_to_follow_user'),
        content: resolveString('amity_social_modal_dialog_generic_error'),
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
        content: resolveString('amity_social_failed_to_unfollow_user'),
      });
    },
  });

  const unFollow = ({ pageId, userId }: { pageId?: string; userId: string }) => {
    confirm({
      pageId,
      type: 'info',
      title: resolveString('amity_social_modal_dialog_title_unfollow_user'),
      content: resolveString('amity_social_unfollow_user_dialog_content'),
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
