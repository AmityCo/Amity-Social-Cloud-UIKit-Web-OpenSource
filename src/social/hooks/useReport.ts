import { UserRepository } from '@amityco/ts-sdk';
import useMemoAsync from '~/core/hooks/useMemoAsync';

/**
 *
 * @deprecated
 */
export default function useReport(user: Amity.User) {
  const isFlaggedByMe = useMemoAsync(
    async () => {
      if (user?.userId && user?.flagCount > 0) {
        return UserRepository.isUserFlaggedByMe(user?.userId);
      }

      return false;
    },
    [user] as any,
  );

  const handleReport = () => {
    return isFlaggedByMe
      ? UserRepository.unflagUser(user?.userId)
      : UserRepository.flagUser(user?.userId);
  };

  return { isFlaggedByMe, handleReport };
}
