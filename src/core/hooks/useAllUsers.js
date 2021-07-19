import { UserRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const userRepo = new UserRepository();

const useAllUsers = () => {
  return useLiveCollection(() => userRepo.getAllUsers());
};

export default useAllUsers;
