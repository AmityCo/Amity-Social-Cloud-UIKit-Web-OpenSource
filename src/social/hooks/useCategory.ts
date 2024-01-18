import { CategoryRepository } from '@amityco/ts-sdk';

import { useEffect, useState } from 'react';

const useCategory = (categoryId?: Amity.Category['categoryId'] | null) => {
  const [category, setCategory] = useState<Amity.Category | null>(null);

  useEffect(() => {
    async function run() {
      if (categoryId == null) return;
      const category = await CategoryRepository.getCategory(categoryId);
      setCategory(category.data);
    }
    run();
  }, [categoryId]);

  return category;
};

export default useCategory;
