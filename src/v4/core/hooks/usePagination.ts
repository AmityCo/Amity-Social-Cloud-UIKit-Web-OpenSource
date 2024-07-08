import { useCallback, useMemo, useState } from 'react';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { AdEngine } from '../AdEngine';
import { useAdSettings, useRecommendAds } from '../providers/AdEngineProvider';
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

  const combineItemsWithAds = useCallback(
    (newItems: T[]) => {
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

        const latestItem = prevItemWithAds[prevItemWithAds.length - 1];

        const startIndex = latestItem
          ? newItems.findIndex((newItem) => getItemId(newItem) === getItemId(latestItem[0]))
          : 0;

        let runningAdIndex = currentAdIndex;
        let runningIndex = currentIndex;
        const suffixItems: Array<[T] | [T, Amity.Ad]> = newItems
          .slice(startIndex + 1)
          .map((newItem) => {
            runningIndex = runningIndex + 1;
            const shouldPlaceAd = runningIndex % frequency.value === 0;

            if (!shouldPlaceAd) return [newItem];

            const ad = recommendedAds[runningAdIndex];
            runningAdIndex =
              runningAdIndex + 1 > recommendedAds.length - 1 ? 0 : runningAdIndex + 1;
            return [newItem, ad];
          });

        setCurrentAdIndex(runningAdIndex);
        setCurrentIndex(runningIndex);
        setItemWithAds([...prevItemWithAds, ...suffixItems]);
        return [...prevItemWithAds, ...suffixItems].flatMap((item) => item);
      } else if (frequency?.type === 'time-window') {
        return [...newItems.slice(0, 1), recommendedAds[0], ...newItems.slice(1)];
      }
      return newItems;
    },
    [currentAdIndex, currentIndex, frequency, itemWithAds, recommendedAds, adSettings?.enabled],
  );

  return { combineItemsWithAds };
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

  const liveCollectionCallback = useCallback<Amity.LiveCollectionCallback<TCallback>>(
    (response) => {
      const newItems = combineItemsWithAds(response.data).flatMap((item) => item);

      callback({ ...response, data: newItems });
    },
    [combineItemsWithAds],
  );

  return useLiveCollection({
    fetcher,
    params,
    callback: liveCollectionCallback,
    config,
    shouldCall,
  });
};

export const usePaginatorApi = <T>(params: {
  items: T[];
  placement: Amity.AdPlacement;
  pageSize: number;
  communityId?: string;
  getItemId: (item: T) => string;
}) => {
  const { items } = params;
  const { combineItemsWithAds } = usePaginatorCore(params);

  const itemWithAds = useMemo(() => combineItemsWithAds(items), [items]);

  return { itemWithAds };
};
