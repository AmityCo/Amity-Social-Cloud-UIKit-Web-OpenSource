/* eslint-disable no-nested-ternary */

import { UserRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';

const useUser = (userId) => {
  const user = useLiveObject(() => UserRepository.getUser(userId), [userId]);

  // Must call this hook even if there is a custom file URL which will override it.
  // Cannot call hooks conditionally due to the 'rules of hooks'.
  let file = useFile(user.avatarFileId, [user.avatarFileId]);

  // Add a Noomer as a display name if user does not have one
  if (!user.displayName) {
    user.displayName = 'Noomer';
  }

  return {
    user,
    file,
  };
};

export default useUser;
