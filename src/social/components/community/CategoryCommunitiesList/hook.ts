import { useMemo } from 'react';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';

export const useCategoryCommunitiesList = ({ categoryId }: { categoryId?: string | null }) => {
  const { onClickCommunity } = useNavigation();
  const { communities, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } =
    useCommunitiesCollection({
      categoryId: categoryId || undefined,
      sortBy: 'displayName',
    });

  const items: (Amity.Community | { skeleton: boolean })[] = useMemo(() => {
    const loadingItems = new Array(5).fill(1).map((_) => ({ skeleton: true }));

    if (isLoading && !loadMoreHasBeenCalled) {
      return loadingItems;
    }

    if (!isLoading) {
      return communities;
    }

    if (isLoading && loadMoreHasBeenCalled) {
      return [...communities, ...loadingItems];
    }

    return loadingItems;
  }, [communities, isLoading, loadMoreHasBeenCalled]);

  return {
    communities: items,
    hasMore,
    loadMore,
    isLoading,
    onClickCommunity,
  };
};
