import React, { useEffect } from 'react';
import { ExploreCommunityCategories } from '~/v4/social/components/ExploreCommunityCategories';
import { RecommendedCommunities } from '~/v4/social/components/RecommendedCommunities';
import { TrendingCommunities } from '~/v4/social/components/TrendingCommunities';
import { useExplore } from '~/v4/social/providers/ExploreProvider';

import styles from './Explore.module.css';
import { ExploreError } from './ExploreError';
import { ExploreEmpty } from '~/v4/social/components/ExploreEmpty';
import { ExploreCommunityEmpty } from '~/v4/social/components/ExploreCommunityEmpty';
import { ExploreTrendingTitle } from '~/v4/social/elements/ExploreTrendingTitle';
import { ExploreRecommendedTitle } from '~/v4/social/elements/ExploreRecommendedTitle';
import { Divider } from '~/v4/social/elements/Divider';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';

type ExploreProps = {
  pageId: string;
};

export function Explore({ pageId }: ExploreProps) {
  const {
    refresh,
    isLoading,
    isEmpty,
    isCommunityEmpty,
    noRecommendedCommunities,
    noTrendingCommunities,
    error,
  } = useExplore();

  useEffect(() => {
    refresh();
  }, []);

  if (error != null) {
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
      <Divider />
      <div className={styles.explore__exploreCategories}>
        <ExploreCommunityCategories pageId={pageId} />
      </div>
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
