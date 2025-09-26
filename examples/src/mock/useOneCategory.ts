import { CategoryRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Used in Storybook stories only to get a single category.
 */

const useOneCategory = () => {
  const [items, setItems] = useState<Amity.Category[]>([]);
  const disposeFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    async function run() {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
      disposeFnRef.current = CategoryRepository.getCategories({}, async (resp) => {
        setItems(resp.data);
      });
    }
    run();

    return () => {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
    };
  }, []);

  if (!items || items.length === 0) return null;

  return items[0];
};

export default useOneCategory;
