/* eslint-disable no-nested-ternary */

import { UserRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';
import useMemoAsync from '~/core/hooks/useMemoAsync';

const userRepo = new UserRepository();

const useUser = (userId, dependencies, resolver) => {
  const user = useLiveObject(() => userRepo.userForId(userId), dependencies, resolver);

  // Must call this hook even if there is a custom file URL which will override it.
  // Cannot call hooks conditionally due to the 'rules of hooks'.
  let file = useFile(user.avatarFileId, [user.avatarFileId]);

  if (user.avatarCustomUrl) {
    file = { fileUrl: user.avatarCustomUrl };
  }

  const isFlaggedByMe = useMemoAsync(
    async () => (user?.userId ? userRepo.isFlaggedByMe({ userId }) : false),
    [user?.userId],
  );

  const handleReportUser = () =>
    isFlaggedByMe ? userRepo.unflag({ userId }) : userRepo.flag({ userId });

  return { user, file, handleReportUser, isFlaggedByMe };
};

export default useUser;
