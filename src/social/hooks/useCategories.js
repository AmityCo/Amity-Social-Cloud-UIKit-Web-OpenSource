import { CommunityRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCategories = query => {
  return useLiveCollection(() => CommunityRepository.queryCategories(query), []);
};

export default useCategories;
