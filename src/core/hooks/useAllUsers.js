import { UserRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useAllUsers = () => {
  return useLiveCollection(() => UserRepository.queryUsers());
};

export default useAllUsers;
