import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCallback } from 'react';

const useUserProfileGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleUserProfileBehavior = useCallback(
    ({
      defaultBehavior,
      allowNonFollower,
      followStatus,
      isCurrentUser,
    }: {
      defaultBehavior?: () => void;
      allowNonFollower?: boolean;
      followStatus?: Amity.FollowStatus['status'] | null;
      isCurrentUser?: boolean;
    }) => {
      if (isVisitorOrBot) {
        AmityGlobalBehavior.handleGuestUserAction?.();
        return false;
      }
      if (allowNonFollower || followStatus === 'accepted' || isCurrentUser) {
        defaultBehavior?.();
        return true;
      }
      AmityGlobalBehavior.handleNonFollowerAction?.();
      return false;
    },
    [isVisitorOrBot, AmityGlobalBehavior],
  );

  return {
    handleUserProfileBehavior,
  };
};

export default useUserProfileGlobalBehavior;
