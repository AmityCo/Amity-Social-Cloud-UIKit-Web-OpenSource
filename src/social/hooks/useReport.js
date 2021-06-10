import { UserRepository } from '@amityco/js-sdk';
import useMemoAsync from '~/core/hooks/useMemoAsync';

const userRepo = new UserRepository();

export default function useReport(user) {
  const isFlaggedByMe = useMemoAsync(async () => {
    if (user?.userId && user?.flagCount > 0) {
      return UserRepository.isFlaggedByMe({ userId: user?.userId });
    }

    return false;
  }, [user]);

  const handleReport = () => {
    return isFlaggedByMe
      ? userRepo.unflag({ userId: user?.userId })
      : userRepo.flag({ userId: user?.userId });
  };

  return { isFlaggedByMe, handleReport };
}
