import React, { createContext, useContext, useEffect, useState } from 'react';
import useCategoriesCollection from '~/v4/core/hooks/collections/useCategoriesCollection';
import { useRecommendedCommunitiesCollection } from '~/v4/core/hooks/collections/useRecommendedCommunitiesCollection';
import { useTrendingCommunitiesCollection } from '~/v4/core/hooks/collections/useTrendingCommunitiesCollection';
import { usePinnedCommunities, EXPLORE_PINNED_TAG } from '~/v4/social/hooks/usePinnedCommunities';

type ExploreContextType = {
  fetchTrendingCommunities: () => void;
  fetchRecommendedCommunities: () => void;
  fetchCommunityCategories: () => void;
  fetchPinnedCommunities: () => void;
  refetchRecommendedCommunities: () => void;
  refreshBothCommunityCollections: () => void;
  isLoading: boolean;
  isCategoryLoading: boolean;
  error: Error | null;
  trendingCommunities: Amity.Community[];
  recommendedCommunities: Amity.Community[];
  pinnedCommunities: Amity.Community[];
  noRecommendedCommunities: boolean;
  noTrendingCommunities: boolean;
  noPinnedCommunities: boolean;
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
  fetchPinnedCommunities: () => {},
  refetchRecommendedCommunities: () => {},
  refreshBothCommunityCollections: () => {},
  trendingCommunities: [],
  recommendedCommunities: [],
  pinnedCommunities: [],
  categories: [],
  isEmpty: false,
  noRecommendedCommunities: false,
  noTrendingCommunities: false,
  noPinnedCommunities: false,
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
  const [pinnedCommunitiesEnable, setPinnedCommunitiesEnable] = useState(false);
  const [pendingJoinCommunities, setPendingJoinCommunities] = useState<string[]>([]);
  const [priorityRecommendedCommunities, setPriorityRecommendedCommunities] = useState<string[]>(
    [],
  );

  const TRENDING_DISPLAY_LIMIT = 7;

  const trendingData = useTrendingCommunitiesCollection({
    // Over-fetch by 1: every user is auto-joined to pinned communities, so they
    // would naturally rank high in Trending and appear in both sections. The
    // trending API has no server-side tag filter, so we fetch one extra and drop
    // any pinned-tagged community on the client below, then cap at the display
    // limit. If 2+ pinned communities happen to trend we show fewer (acceptable).
    params: { limit: TRENDING_DISPLAY_LIMIT + 1 },
    enabled: trendingCommunitiesEnable,
  });

  const pinnedData = usePinnedCommunities({ shouldCall: pinnedCommunitiesEnable });

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

  // Pinned communities are auto-joined, so exclude them from Trending (they'd
  // otherwise rank high from the join velocity). Filter by the pinned tag, then
  // cap at the display limit.
  const trendingCommunities = trendingData.trendingCommunities
    .filter((community) => !community.tags?.includes(EXPLORE_PINNED_TAG))
    .slice(0, TRENDING_DISPLAY_LIMIT);

  const pinnedCommunities = pinnedData.pinnedCommunities || [];

  // Auto-join every pinned community the user is not already in. Runs off the
  // SAME pinned query used to render the section (no second fetch). Fire-and-
  // forget so it never blocks render; each join is isolated so one failure does
  // not affect the others. We intentionally do NOT re-query on success — the
  // section is meant to feel permanent and membership is auto-managed.
  useEffect(() => {
    if (!pinnedCommunities.length) return;
    pinnedCommunities.forEach((community) => {
      if (community.isJoined) return;
      try {
        Promise.resolve(community.join()).catch(() => {
          // Ignore individual join failures (e.g. already joined, transient
          // network error) — pinned membership is best-effort.
        });
      } catch {
        // community.join() may throw synchronously in edge cases; swallow so a
        // single failure never breaks the loop or the render.
      }
    });
  }, [pinnedCommunities]);

  const isLoading =
    trendingData.isLoading ||
    (recommendedData.isLoading && recommendedCommunitiesEnable) ||
    (pinnedData.isLoading && pinnedCommunitiesEnable) ||
    categoriesData.isLoading;

  const error =
    trendingData.error || recommendedData.error || categoriesData.error || pinnedData.error || null;

  const refetchRecommendedCommunities = () => recommendedData.refresh();

  const refresh = () => {
    trendingData.refresh();
    refetchRecommendedCommunities();
    categoriesData.refresh();
    pinnedData.refresh();
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

  const noTrendingCommunities = trendingCommunities.length === 0 && !trendingData.isLoading;

  const noPinnedCommunities =
    !pinnedData.isLoading && pinnedCommunities.length === 0 && pinnedCommunitiesEnable;

  const isCommunityEmpty = noRecommendedCommunities && noTrendingCommunities && noPinnedCommunities;

  const isEmpty = noCategories && isCommunityEmpty;

  const fetchTrendingCommunities = () => setTrendingCommunitiesEnable(true);
  const fetchRecommendedCommunities = () => setRecommendedCommunitiesEnable(true);
  const fetchCommunityCategories = () => setCommunityCategoriesEnable(true);
  const fetchPinnedCommunities = () => setPinnedCommunitiesEnable(true);

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
        fetchPinnedCommunities,
        refetchRecommendedCommunities,
        refreshBothCommunityCollections,
        trendingCommunities,
        recommendedCommunities: recommendedData.recommendedCommunities || [],
        pinnedCommunities,
        categories: categoriesData.categories,
        noRecommendedCommunities,
        noTrendingCommunities,
        noPinnedCommunities,
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
