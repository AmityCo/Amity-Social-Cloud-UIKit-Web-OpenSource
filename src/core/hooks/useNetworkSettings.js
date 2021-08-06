import { UserRepository } from '@amityco/js-sdk';

import useMemoAsync from '~/core/hooks/useMemoAsync';

const useNetworkSettings = () => {
  const isPrivateNetwork = useMemoAsync(UserRepository.isPrivateNetwork);

  return {
    isPrivateNetwork: Boolean(isPrivateNetwork),
  };
};

export default useNetworkSettings;
