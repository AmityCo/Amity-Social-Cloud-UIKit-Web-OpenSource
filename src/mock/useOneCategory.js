import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

/**
 * Used in Storybook stories only to get a single category.
 */

const useOneCategory = () => {
  const [catgeories] = useLiveCollection(() => CommunityRepository.queryCategories());
  return catgeories[0] || { categoryId: 'Web-Test' };
};

export default useOneCategory;
