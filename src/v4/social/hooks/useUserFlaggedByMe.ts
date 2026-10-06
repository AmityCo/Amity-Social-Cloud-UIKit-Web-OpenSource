import { UserRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';

/**
 * Report / unreport toggle for a user object. The label state starts from the object's own
 * `isFlaggedByMe` hint (local Bloom test, no request) and follows the object when a live
 * collection re-delivers it. After a flag, the state comes from the user the SDK returns.
 * After an unflag it is confirmed with `user.getUserFlagsByMe()`, because the caller may
 * still hold another report and the hint must never be forced to `false` locally.
 */
const useUserFlaggedByMe = (user?: Amity.User | null) => {
  const { isVisitorOrBot } = useSDK();
  const hint = !isVisitorOrBot && (user?.isFlaggedByMe ?? false);
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(hint);

  useEffect(() => {
    setIsFlaggedByMe(hint);
  }, [hint, user?.userId]);

  const flagUser = async () => {
    if (!user) return;
    try {
      const flagged = await UserRepository.flagUser(user.userId);
      setIsFlaggedByMe(flagged.isFlaggedByMe);
    } catch (error) {
      setIsFlaggedByMe(hint);
      throw error;
    }
  };

  const unflagUser = async () => {
    if (!user) return;
    try {
      await UserRepository.unflagUser(user.userId);
      const { isFlagByMe } = await user.getUserFlagsByMe();
      setIsFlaggedByMe(isFlagByMe);
    } catch (error) {
      setIsFlaggedByMe(hint);
      throw error;
    }
  };

  const toggleFlagUser = async () => {
    if (!user) return;
    if (isFlaggedByMe) {
      await unflagUser();
    } else {
      await flagUser();
    }
  };

  return {
    isLoading: false,
    isFlaggedByMe,
    flagUser,
    unflagUser,
    toggleFlagUser,
  };
};

export default useUserFlaggedByMe;
