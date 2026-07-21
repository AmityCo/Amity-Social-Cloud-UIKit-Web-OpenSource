import React, { useEffect } from 'react';
import { ExploreCommunityCategories } from '~/v4/social/components/ExploreCommunityCategories';
import { RecommendedCommunities } from '~/v4/social/components/RecommendedCommunities';
import { TrendingCommunities } from '~/v4/social/components/TrendingCommunities';
import { PinnedCommunities } from '~/v4/social/components/PinnedCommunities';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import styles from './ExploreComponent.module.css';
import { ExploreError } from './ExploreError';
import { ExploreEmpty } from '~/v4/social/components/ExploreEmpty';
import { ExploreCommunityEmpty } from '~/v4/social/components/ExploreCommunityEmpty';
import { ExploreTrendingTitle } from '~/v4/social/elements/ExploreTrendingTitle';
import { ExploreRecommendedTitle } from '~/v4/social/elements/ExploreRecommendedTitle';
import { ExplorePinnedTitle } from '~/v4/social/elements/ExplorePinnedTitle';
import { Divider } from '~/v4/social/elements/Divider';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ERROR_CODE } from '~/v4/social/constants/errorResponse';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type ExploreProps = {
  pageId?: string;
};

export function Explore({ pageId = '*' }: ExploreProps) {
  const {
    refresh,
    isLoading,
    isEmpty,
    isCommunityEmpty,
    isNoCategory,
    noRecommendedCommunities,
    noTrendingCommunities,
    noPinnedCommunities,
    pinnedCommunities,
    error,
  } = useExplore();

  const { isDesktop } = useResponsive();
  const { goToVisitorUsageLimitPage } = useNavigation();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (error?.message?.includes(ERROR_CODE.VISITOR_USAGE_LIMIT)) {
      goToVisitorUsageLimitPage();
    }
  }, [error]);

  if (error != null) {
    if (error.message?.includes(ERROR_CODE.VISITOR_USAGE_LIMIT)) return null;
    return <ExploreError />;
  }

  if (isEmpty) {
    return (
      <PullToRefresh className={styles.explore} onTouchEndCallback={refresh}>
        <Divider />
        <ExploreEmpty pageId={pageId} />
      </PullToRefresh>
    );
  }

  if (isCommunityEmpty) {
    return (
      <PullToRefresh className={styles.explore} onTouchEndCallback={refresh}>
        <Divider />
        <div className={styles.explore__exploreCategories}>
          <ExploreCommunityCategories pageId={pageId} />
        </div>
        <Divider className={styles.explore__divider} />
        <ExploreCommunityEmpty pageId={pageId} />
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh className={styles.explore} onTouchEndCallback={refresh}>
      {!isNoCategory && (
        <div className={styles.explore__exploreCategories}>
          <ExploreCommunityCategories pageId={pageId} />
        </div>
      )}
      <Divider className={styles.explore__divider} />
      {!noPinnedCommunities ? (
        <div className={styles.explore__pinnedCommunities}>
          {isLoading ? (
            <div className={styles.explore__trendingTitleSkeleton} />
          ) : (
            <ExplorePinnedTitle pageId={pageId} isSingle={pinnedCommunities.length === 1} />
          )}
          <PinnedCommunities pageId={pageId} />
        </div>
      ) : null}
      <Divider className={styles.explore__divider} />
      {!noRecommendedCommunities ? (
        <div className={styles.explore__recommendedForYou} data-is-loading={!!isLoading}>
          {isLoading ? (
            <div className={styles.explore__trendingTitleSkeleton} />
          ) : (
            <ExploreRecommendedTitle pageId={pageId} />
          )}
          <RecommendedCommunities pageId={pageId} />
        </div>
      ) : null}
      <Divider className={styles.explore__divider} />
      {!noTrendingCommunities ? (
        <div className={styles.explore__trendingNow}>
          {isLoading ? (
            <div className={styles.explore__trendingTitleSkeleton} />
          ) : (
            <ExploreTrendingTitle pageId={pageId} />
          )}
          <TrendingCommunities pageId={pageId} />
        </div>
      ) : null}
    </PullToRefresh>
  );
}
