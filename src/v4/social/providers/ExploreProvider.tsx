import React, { createContext, useContext, useEffect, useState } from 'react';
import useCategoriesCollection from '~/v4/core/hooks/collections/useCategoriesCollection';
import { useRecommendedCommunitiesCollection } from '~/v4/core/hooks/collections/useRecommendedCommunitiesCollection';
import { useTrendingCommunitiesCollection } from '~/v4/core/hooks/collections/useTrendingCommunitiesCollection';
import { usePinnedCommunities, EXPLORE_PINNED_TAG } from '~/v4/social/hooks/usePinnedCommunities';
import useSDK from '~/v4/core/hooks/useSDK';
import { signalFeedRefresh } from '~/v4/core/stores/pendingVisitorJoin';

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
  const { isVisitorOrBot } = useSDK();
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

  // Auto-join pinned communities when a signed-in user lands on Explore (this
  // provider only mounts while the Explore tab is open). For each pinned
  // community not already joined (isJoined === false) we join once; already-
  // joined ones are skipped so no redundant call is made. Runs off the SAME
  // pinned query used to render the section (no second fetch).
  useEffect(() => {
    // Never in visitor/bot mode — a read-only session cannot join, so every
    // call would fail. isVisitorOrBot is in the deps so it runs once the user
    // becomes signed-in and the pinned list is present.
    if (isVisitorOrBot) return;
    if (!pinnedCommunities.length) return;

    let cancelled = false;
    const retryTimeouts: ReturnType<typeof setTimeout>[] = [];

    const toJoin = pinnedCommunities.filter((community) => !community.isJoined);
    if (toJoin.length === 0) return;

    const joins = toJoin.map((community) => {
      try {
        // Each join is isolated — one failure (transient error) must not affect
        // the others.
        return Promise.resolve(community.join()).then(
          () => true,
          () => false,
        );
      } catch {
        return Promise.resolve(false);
      }
    });

    // Once the joins settle, pulse a feed-refresh signal so the newsfeed shows
    // posts from the newly joined pinned communities without a manual reload.
    // The server's feed view of the new membership can lag a beat behind the
    // join resolving, so signal once immediately and once more after a short
    // delay to catch that propagation window.
    Promise.all(joins).then((results) => {
      if (cancelled) return;
      if (!results.some(Boolean)) return; // nothing actually joined
      signalFeedRefresh();
      retryTimeouts.push(setTimeout(() => signalFeedRefresh(), 1500));
    });

    return () => {
      cancelled = true;
      retryTimeouts.forEach(clearTimeout);
    };
  }, [pinnedCommunities, isVisitorOrBot]);

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
