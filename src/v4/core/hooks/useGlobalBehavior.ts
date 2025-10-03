import useSDK from '~/v4/core/hooks/useSDK';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCallback } from 'react';

const useGlobalBehavior = () => {
  const { isVisitorOrBot } = useSDK();
  const { AmityGlobalBehavior } = usePageBehavior();

  const handleGlobalBehavior = useCallback(
    ({ defaultBehavior }: { defaultBehavior?: () => void }) => {
      if (isVisitorOrBot) {
        return AmityGlobalBehavior.handleGuestUserAction?.();
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
