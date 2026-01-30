import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import { useCallback } from 'react';

const useUserProfileGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleUserProfileBehavior = useCallback(
    ({
      alignment = 'withSidebar',
      defaultBehavior,
      allowNonFollower,
      followStatus,
      isCurrentUser,
      defaultCallback,
    }: {
      alignment?: NotificationAlignment;
      defaultBehavior?: () => void;
      allowNonFollower?: boolean;
      followStatus?: Amity.FollowStatus['status'] | null;
      isCurrentUser?: boolean;
      defaultCallback?: () => void;
    }) => {
      if (isVisitorOrBot) {
        defaultCallback?.();
        AmityGlobalBehavior?.handleVisitorUserAction?.({ alignment });
        return false;
      }
      if (allowNonFollower || followStatus === 'accepted' || isCurrentUser) {
        defaultBehavior?.();
        return true;
      }
      defaultCallback?.();
      AmityGlobalBehavior?.handleNonFollowerAction?.({ alignment });
      return false;
    },
    [isVisitorOrBot, AmityGlobalBehavior],
  );

  return {
    handleUserProfileBehavior,
  };
};

export default useUserProfileGlobalBehavior;
