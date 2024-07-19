import React, { useContext, useEffect, useState, createContext } from 'react';
import { AdEngine } from '../AdEngine';
import { AdSupplier } from '../AdSupplier';
import { TimeWindowTracker } from '../TimeWindowTracker';

export const AdEngineContext = createContext<{
  ads: Amity.Ad[];
  settings: Amity.AdsSettings | null;
  isLoading: boolean;
  saveItemsPagination: (data: {
    targetId?: string;
    placement: string;
    frequencyType: string;
    adId: string;
    referenceId: string;
  }) => void;
  getItemsPaginationCache: (data: {
    targetId?: string;
    frequencyType: string;
    placement: string;
  }) => { adId: string; referenceId: string }[] | undefined;
}>({
  isLoading: true,
  ads: [],
  settings: null,
  saveItemsPagination: () => {},
  getItemsPaginationCache: () => undefined,
});

export const AdEngineProvider: React.FC = ({ children }) => {
  const [networkAds, setNetworkAds] = useState<Amity.NetworkAds | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [itemsPaginationCache, setItemsPaginationCache] = useState(
    new Map<string, { adId: string; referenceId: string }[]>(),
  );

  const getCacheKey = ({
    targetId,
    placement,
    frequencyType,
  }: {
    targetId?: string;
    placement: string;
    frequencyType: string;
  }) => {
    if (targetId) {
      return `${frequencyType}-${placement}-${frequencyType}`;
    } else {
      return `global-${placement}-${frequencyType}`;
    }
  };

  const saveItemsPagination = ({
    targetId,
    placement,
    adId,
    referenceId,
    frequencyType,
  }: {
    targetId?: string;
    placement: string;
    adId: string;
    referenceId: string;
    frequencyType: string;
  }) => {
    setItemsPaginationCache((prev) => {
      const cacheKey = getCacheKey({ targetId, placement, frequencyType });
      const prevValue = prev.get(cacheKey);
      if (prevValue) {
        prev.set(cacheKey, [...prevValue, { adId, referenceId }]);
      } else {
        prev.set(cacheKey, [{ adId, referenceId }]);
      }
      return new Map(prev);
    });
  };

  const getItemsPaginationCache = ({
    targetId,
    placement,
    frequencyType,
  }: {
    targetId?: string;
    placement: string;
    frequencyType: string;
  }) => {
    const cacheKey = getCacheKey({ targetId, placement, frequencyType });
    return itemsPaginationCache.get(cacheKey);
  };

  useEffect(() => {
    async function init() {
      AdEngine.instance.onNetworkAdsData((networkAds) => {
        setNetworkAds(networkAds);
        setIsLoading(false);
      });
    }
    init();
  }, []);

  return (
    <AdEngineContext.Provider
      value={{
        isLoading,
        ads: networkAds?.ads || [],
        settings: networkAds?.settings || null,
        saveItemsPagination,
        getItemsPaginationCache,
      }}
    >
      {children}
    </AdEngineContext.Provider>
  );
};

export const useAds = () => {
  const adContext = useContext(AdEngineContext);
  return adContext.ads;
};

export const useAdSettings = () => {
  const adContext = useContext(AdEngineContext);
  return adContext.settings;
};

export const useRecommendAds = ({
  count,
  placement,
  communityId,
}: {
  count: number;
  placement: Amity.AdPlacement;
  communityId?: string;
}) => {
  const adContext = useContext(AdEngineContext);
  const ads = adContext.ads;
  const [recommendedAds, setRecommendedAds] = useState<Amity.Ad[]>([]);
  const adSettings = useAdSettings();
  const adFrequency = AdEngine.instance.getAdFrequencyByPlacement(placement);

  useEffect(() => {
    if (!adSettings?.enabled) {
      return;
    }
    if (
      adFrequency?.type === 'time-window' &&
      TimeWindowTracker.instance.hasReachedLimit(placement)
    ) {
      return;
    }

    setRecommendedAds(
      AdSupplier.instance.recommendedAds({
        ads,
        placement,
        count,
        communityId,
      }),
    );
  }, [ads, count, placement, communityId]);

  return recommendedAds;
};
