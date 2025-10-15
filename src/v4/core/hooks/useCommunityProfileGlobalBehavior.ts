import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCallback } from 'react';

const useCommunityProfileGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleCommunityProfileBehavior = useCallback(
    ({
      defaultBehavior,
      allowNonMember,
      isJoined,
    }: {
      defaultBehavior?: (() => Promise<void>) | (() => void);
      allowNonMember?: boolean;
      isJoined?: boolean;
    }) => {
      if (isVisitorOrBot) {
        AmityGlobalBehavior?.handleVisitorUserAction?.();
        return false;
      }
      if (allowNonMember || isJoined) {
        defaultBehavior?.();
        return true;
      }
      AmityGlobalBehavior?.handleNonMemberAction?.();
      return false;
    },
    [isVisitorOrBot, AmityGlobalBehavior],
  );

  return {
    handleCommunityProfileBehavior,
  };
};

export default useCommunityProfileGlobalBehavior;
