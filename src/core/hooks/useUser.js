/* eslint-disable no-nested-ternary */

import { UserRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';

const userRepo = new UserRepository();

const useUser = (userId, dependencies, resolver) => {
  const user = useLiveObject(() => userRepo.userForId(userId), dependencies, resolver);

  // Must call this hook even if there is a custom file URL which will override it.
  // Cannot call hooks conditionally due to the 'rules of hooks'.
  let file = useFile(user.avatarFileId, [user.avatarFileId]);

  if (user.avatarCustomUrl) {
    file = { fileUrl: user.avatarCustomUrl };
  }

  const handleReportUser = () => userRepo.flag({ userId });

  return { user, file, handleReportUser };
};

export default useUser;
