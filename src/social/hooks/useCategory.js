import { CommunityRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';

const useCategory = categoryId => {
  const category = useLiveObject(() => CommunityRepository.categoryForId(categoryId), [categoryId]);

  const file = useFile(category.avatarFileId, [category.avatarFileId]);

  return { category, file };
};

export default useCategory;
