import { useMemo, useState } from 'react';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { AdEngine } from '~/v4/core/AdEngine';
import { useAdSettings, useRecommendAds } from '~/v4/core/providers/AdEngineProvider';
import { isNonNullable } from '~/v4/helpers/utils';

const usePaginatorCore = <T>({
  placement,
  pageSize,
  communityId,
  getItemId,
}: {
  placement: Amity.AdPlacement;
  pageSize: number;
  communityId?: string;
  getItemId: (item: T) => string;
}) => {
  const adSettings = useAdSettings();

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [itemWithAds, setItemWithAds] = useState<Array<[T] | [T, Amity.Ad]>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const frequency = AdEngine.instance.getAdFrequencyByPlacement(placement);

  const count = (() => {
    if (frequency?.type === 'fixed') {
      return pageSize / frequency.value;
    }
    return 1;
  })();

  const recommendedAds = useRecommendAds({ count, placement, communityId });

  const reset = () => {
    setCurrentAdIndex(0);
    setItemWithAds([]);
    setCurrentIndex(0);
  };

  const combineItemsWithAds = (newItems: T[]) => {
    if (!adSettings?.enabled) {
      return newItems;
    }
    if (frequency?.type === 'fixed') {
      const newItemIds = new Set(newItems.map((item) => getItemId(item)));

      const prevItemWithAds = itemWithAds
        .map((itemWithAd) => {
          const itemId = getItemId(itemWithAd[0]);

          if (!newItemIds.has(itemId)) {
            return null;
          }
          return itemWithAd;
        })
        .filter(isNonNullable);

      const startItem = prevItemWithAds[0];

      const topIndex = (() => {
        if (startItem) {
          const foundedIndex = newItems.findIndex(
            (newItem) => getItemId(newItem) === getItemId(startItem[0]),
          );
          if (foundedIndex === -1) {
            return 0;
          }
          return foundedIndex;
        }
        return 0;
      })();

      const newestItems: Array<[T]> = (newItems || []).slice(0, topIndex).map((item) => [item]);

      const prevItems = [...newestItems, ...prevItemWithAds];

      const filteredNewItems = newItems.slice(topIndex).filter((newItem) => {
        const itemId = getItemId(newItem);
        return !prevItems.some((prevItem) => getItemId(prevItem[0]) === itemId);
      });

      let runningAdIndex = currentAdIndex;
      let runningIndex = currentIndex;
      const suffixItems: Array<[T] | [T, Amity.Ad]> = filteredNewItems.map((newItem) => {
        runningIndex = runningIndex + 1;
        const shouldPlaceAd = runningIndex % frequency.value === 0;

        if (!shouldPlaceAd) return [newItem];

        const ad = recommendedAds[runningAdIndex];
        runningAdIndex = runningAdIndex + 1 > recommendedAds.length - 1 ? 0 : runningAdIndex + 1;
        return [newItem, ad];
      });

      setCurrentAdIndex(runningAdIndex);
      setCurrentIndex(runningIndex);
      const newItemsWithAds = [...prevItems, ...suffixItems];
      setItemWithAds([...prevItems, ...suffixItems]);
      if (newItemsWithAds.length === 0) {
        setCurrentAdIndex(0);
        setCurrentIndex(0);
      }
      return [...prevItems, ...suffixItems].flatMap((item) => item);
    } else if (frequency?.type === 'time-window') {
      if (newItems.length === 0) {
        return newItems;
      }
      return [...newItems.slice(0, 1), recommendedAds[0], ...newItems.slice(1)].filter(
        isNonNullable,
      );
    }
    return newItems;
  };

  return { combineItemsWithAds, reset };
};

export const usePaginator = <TCallback, TParams>({
  fetcher,
  params,
  callback = () => {},
  config,
  shouldCall = true,
  placement,
  communityId,
  pageSize,
  getItemId,
}: {
  fetcher: (
    params: Amity.LiveCollectionParams<TParams>,
    callback: Amity.LiveCollectionCallback<TCallback>,
    config?: Amity.LiveCollectionConfig,
  ) => Amity.Unsubscriber;
  params: Amity.LiveCollectionParams<TParams>;
  callback?: Amity.LiveCollectionCallback<TCallback | Amity.Ad>;
  config?: Amity.LiveCollectionConfig;
  shouldCall?: boolean;
  placement: Amity.AdPlacement;
  communityId?: string;
  pageSize: number;
  getItemId: (item: TCallback) => string;
}): {
  items: Array<TCallback | Amity.Ad>;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
  loadMoreHasBeenCalled: boolean;
} => {
  const { combineItemsWithAds } = usePaginatorCore({
    placement,
    pageSize,
    communityId,
    getItemId,
  });

  const { items, ...rest } = useLiveCollection({
    fetcher,
    params,
    config,
    shouldCall,
  });

  const itemWithAds = useMemo(() => combineItemsWithAds(items).flatMap((item) => item), [items]);

  return {
    ...rest,
    items: itemWithAds,
  };
};

export const usePaginatorApi = <T>(params: {
  items: T[];
  placement: Amity.AdPlacement;
  pageSize: number;
  communityId?: string;
  getItemId: (item: T) => string;
}) => {
  const { items, ...rest } = params;
  const { combineItemsWithAds, reset } = usePaginatorCore(rest);

  const itemWithAds = useMemo(() => combineItemsWithAds(items), [items]);

  return { itemWithAds, reset };
};
