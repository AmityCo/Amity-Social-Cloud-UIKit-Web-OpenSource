import { UserRepository } from 'eko-sdk';

import { testUser } from '~/mock';

export const getUser = userId => {
  if (userId) {
    const userRepo = new UserRepository();
    return (userRepo.userForId(userId) || {}).model || testUser;
  }

  return testUser;
};
