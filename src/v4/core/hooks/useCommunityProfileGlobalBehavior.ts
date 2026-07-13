import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCallback } from 'react';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import { setPendingVisitorJoin } from '~/v4/core/stores/pendingVisitorJoin';

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
      communityId,
    }: {
      alignment?: NotificationAlignment;
      defaultBehavior?: (() => Promise<void>) | (() => void);
      allowNonMember?: boolean;
      isJoined?: boolean;
      defaultCallback?: (() => Promise<void>) | (() => void);
      /**
       * The community the visitor is trying to join. When provided, it is
       * recorded so the UIKit can auto-join it once the visitor finishes
       * signing in, and is forwarded to `handleVisitorUserAction` so the host
       * can react (e.g. open its sign-in flow for that community).
       */
      communityId?: string;
    }) => {
      if (isVisitorOrBot) {
        // Remember which community the visitor wanted to join so it can be
        // auto-joined after they sign in. Only set when we actually have an id;
        // a visitor action without one (e.g. a react/comment gate) leaves any
        // previously recorded join intent untouched.
        if (communityId) {
          setPendingVisitorJoin(communityId);
        }
        defaultCallback?.();
        AmityGlobalBehavior?.handleVisitorUserAction?.({ alignment, communityId });
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
