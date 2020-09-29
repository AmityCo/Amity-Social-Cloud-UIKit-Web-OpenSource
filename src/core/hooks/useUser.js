/* eslint-disable no-nested-ternary */

import { UserRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';

const userRepo = new UserRepository();

export default userId => {
  const user = useLiveObject(() => userRepo.userForId(userId), []);

  const file = user.avatarCustomUrl
    ? { fileUrl: user.avatarCustomUrl }
    : user.avatarFileId
    ? useFile(user.avatarFileId)
    : {};

  return { user, file };
};
