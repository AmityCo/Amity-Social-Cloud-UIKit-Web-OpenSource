import { UserRepository } from '@amityco/js-sdk';
import useMemoAsync from '~/core/hooks/useMemoAsync';

export default function useReport(user) {
  const isFlaggedByMe = useMemoAsync(async () => {
    if (user?.userId && user?.flagCount > 0) {
      return UserRepository.isFlaggedByMe(user?.userId);
    }

    return false;
  }, [user]);

  const handleReport = () => {
    return isFlaggedByMe ? UserRepository.unflag(user?.userId) : UserRepository.flag(user?.userId);
  };

  return { isFlaggedByMe, handleReport };
}
