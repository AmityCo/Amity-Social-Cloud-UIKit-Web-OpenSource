import { CategoryRepository } from '@amityco/ts-sdk';

import { useEffect, useState } from 'react';

const useCategoriesByIds = (categoryIds?: string[]) => {
  const [categories, setCategories] = useState<Amity.Category[]>([]);

  useEffect(() => {
    async function run() {
      if (categoryIds == null || categoryIds.length === 0) return;
      const categories = await Promise.all(
        categoryIds.map(
          async (categoryId) => (await CategoryRepository.getCategory(categoryId)).data,
        ),
      );
      setCategories(categories);
    }
    run();
  }, [categoryIds]);

  return categories;
};

export default useCategoriesByIds;
