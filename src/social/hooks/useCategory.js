import { CommunityRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useCategory = categoryId => {
  const currentCategory = useLiveObject(() => CommunityRepository.categoryForId(categoryId), [
    categoryId,
  ]);

  return {
    currentCategory,
  };
};

export default useCategory;
