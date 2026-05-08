import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { type NotificationAlignment } from '~/v4/core/components/Notification';
import { useCallback } from 'react';

const useGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleGlobalBehavior = useCallback(
    ({
      defaultBehavior,
      alignment = 'fixed',
    }: {
      defaultBehavior?: () => void;
      alignment?: NotificationAlignment;
    }) => {
      if (isVisitorOrBot) {
        return AmityGlobalBehavior?.handleVisitorUserAction?.({ alignment });
      }

      return defaultBehavior?.();
    },
    [isVisitorOrBot, AmityGlobalBehavior],
  );

  return {
    handleGlobalBehavior,
  };
};

export default useGlobalBehavior;
