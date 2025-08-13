import React, { createContext, useContext, useState } from 'react';
import useCategoriesCollection from '~/v4/core/hooks/collections/useCategoriesCollection';
import { useRecommendedCommunitiesCollection } from '~/v4/core/hooks/collections/useRecommendedCommunitiesCollection';
import { useTrendingCommunitiesCollection } from '~/v4/core/hooks/collections/useTrendingCommunitiesCollection';

type ExploreContextType = {
  fetchTrendingCommunities: () => void;
  fetchRecommendedCommunities: () => void;
  fetchCommunityCategories: () => void;
  refetchRecommendedCommunities: () => void;
  refreshBothCommunityCollections: () => void;
  isLoading: boolean;
  isCategoryLoading: boolean;
  error: Error | null;
  trendingCommunities: Amity.Community[];
  recommendedCommunities: Amity.Community[];
  noRecommendedCommunities: boolean;
  noTrendingCommunities: boolean;
  isEmpty: boolean;
  isCommunityEmpty: boolean;
  isNoCategory: boolean;
  categories: Amity.Category[];
  refresh: () => void;
  pendingJoinCommunities: string[];
  setPendingJoinCommunity: (communityId: string) => void;
  removePendingJoinCommunity: (communityId: string) => void;
  priorityRecommendedCommunities: string[];
  addPriorityRecommendedCommunity: (communityId: string) => void;
  removePriorityRecommendedCommunity: (communityId: string) => void;
};

const ExploreContext = createContext<ExploreContextType>({
  fetchTrendingCommunities: () => {},
  fetchRecommendedCommunities: () => {},
  fetchCommunityCategories: () => {},
  refetchRecommendedCommunities: () => {},
  refreshBothCommunityCollections: () => {},
  trendingCommunities: [],
  recommendedCommunities: [],
  categories: [],
  isEmpty: false,
  noRecommendedCommunities: false,
  noTrendingCommunities: false,
  isCommunityEmpty: false,
  isLoading: false,
  isCategoryLoading: false,
  isNoCategory: false,
  error: null,
  refresh: () => {},
  pendingJoinCommunities: [],
  setPendingJoinCommunity: () => {},
  removePendingJoinCommunity: () => {},
  priorityRecommendedCommunities: [],
  addPriorityRecommendedCommunity: () => {},
  removePriorityRecommendedCommunity: () => {},
});

export const useExplore = () => useContext(ExploreContext);

type ExploreProviderProps = {
  children: React.ReactNode;
};

export const ExploreProvider: React.FC<ExploreProviderProps> = ({ children }) => {
  const [trendingCommunitiesEnable, setTrendingCommunitiesEnable] = useState(false);
  const [recommendedCommunitiesEnable, setRecommendedCommunitiesEnable] = useState(false);
  const [communityCategoriesEnable, setCommunityCategoriesEnable] = useState(false);
  const [pendingJoinCommunities, setPendingJoinCommunities] = useState<string[]>([]);
  const [priorityRecommendedCommunities, setPriorityRecommendedCommunities] = useState<string[]>(
    [],
  );

  const trendingData = useTrendingCommunitiesCollection({
    params: { limit: 7 },
    enabled: trendingCommunitiesEnable,
  });

  const recommendedData = useRecommendedCommunitiesCollection({
    params: { limit: 15 }, // Fetch more to account for filtering
    enabled: recommendedCommunitiesEnable,
  });

  const categoriesData = useCategoriesCollection({
    query: {
      limit: 5,
      sortBy: 'name',
    },
    enabled: communityCategoriesEnable,
  });

  const isLoading =
    trendingData.isLoading ||
    (recommendedData.isLoading && recommendedCommunitiesEnable) ||
    categoriesData.isLoading;

  const error = trendingData.error || recommendedData.error || categoriesData.error || null;

  const refetchRecommendedCommunities = () => recommendedData.refresh();

  const refresh = () => {
    trendingData.refresh();
    refetchRecommendedCommunities();
    categoriesData.refresh();
  };

  const refreshBothCommunityCollections = () => {
    trendingData.refresh();
    refetchRecommendedCommunities();
  };

  const noCategories = categoriesData.categories.length === 0 && !categoriesData.isLoading;

  const noRecommendedCommunities =
    (recommendedData?.recommendedCommunities?.length === 0 ||
      recommendedData?.recommendedCommunities === null) &&
    !recommendedData.isLoading &&
    recommendedCommunitiesEnable;

  const noTrendingCommunities =
    trendingData.trendingCommunities.length === 0 && !trendingData.isLoading;

  const isCommunityEmpty = noRecommendedCommunities && noTrendingCommunities;

  const isEmpty = noCategories && isCommunityEmpty;

  const fetchTrendingCommunities = () => setTrendingCommunitiesEnable(true);
  const fetchRecommendedCommunities = () => setRecommendedCommunitiesEnable(true);
  const fetchCommunityCategories = () => setCommunityCategoriesEnable(true);

  const setPendingJoinCommunity = (communityId: string) => {
    setPendingJoinCommunities((prev) => [...prev, communityId]);
  };

  const removePendingJoinCommunity = (communityId: string) => {
    setPendingJoinCommunities((prev) => prev.filter((id) => id !== communityId));
  };

  const addPriorityRecommendedCommunity = (communityId: string) => {
    setPriorityRecommendedCommunities((prev) => {
      if (!prev.includes(communityId)) {
        return [...prev, communityId];
      }
      return prev;
    });
  };

  const removePriorityRecommendedCommunity = (communityId: string) => {
    setPriorityRecommendedCommunities((prev) => prev.filter((id) => id !== communityId));
  };

  return (
    <ExploreContext.Provider
      value={{
        fetchTrendingCommunities,
        fetchRecommendedCommunities,
        fetchCommunityCategories,
        refetchRecommendedCommunities,
        refreshBothCommunityCollections,
        trendingCommunities: trendingData.trendingCommunities,
        recommendedCommunities: recommendedData.recommendedCommunities || [],
        categories: categoriesData.categories,
        noRecommendedCommunities,
        noTrendingCommunities,
        isEmpty,
        isCommunityEmpty,
        isNoCategory: noCategories,
        isLoading,
        isCategoryLoading: categoriesData.isLoading,
        error,
        refresh,
        pendingJoinCommunities,
        setPendingJoinCommunity,
        removePendingJoinCommunity,
        priorityRecommendedCommunities,
        addPriorityRecommendedCommunity,
        removePriorityRecommendedCommunity,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
