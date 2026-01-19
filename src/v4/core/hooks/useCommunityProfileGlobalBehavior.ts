import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCallback } from 'react';
import { NotificationAlignment } from '~/v4/core/components/Notification';

const useCommunityProfileGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleCommunityProfileBehavior = useCallback(
    ({
      alignment = 'withSidebar',
      defaultBehavior,
      allowNonMember,
      isJoined,
      defaultCallback,
    }: {
      alignment?: NotificationAlignment;
      defaultBehavior?: (() => Promise<void>) | (() => void);
      allowNonMember?: boolean;
      isJoined?: boolean;
      defaultCallback?: (() => Promise<void>) | (() => void);
    }) => {
      if (isVisitorOrBot) {
        defaultCallback?.();
        AmityGlobalBehavior?.handleVisitorUserAction?.({ alignment });
        return false;
      }
      if (allowNonMember || isJoined) {
        defaultBehavior?.();
        return true;
      }
      defaultCallback?.();
      AmityGlobalBehavior?.handleNonMemberAction?.({ alignment });
      return false;
    },
    [isVisitorOrBot, AmityGlobalBehavior],
  );

  return {
    handleCommunityProfileBehavior,
  };
};

export default useCommunityProfileGlobalBehavior;
