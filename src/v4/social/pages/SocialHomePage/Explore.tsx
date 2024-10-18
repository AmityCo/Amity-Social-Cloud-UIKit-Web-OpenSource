import React, { useRef, useState } from 'react';
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
import { RefreshSpinner } from '~/v4/icons/RefreshSpinner';

interface ExploreProps {
  pageId: string;
}

export function Explore({ pageId }: ExploreProps) {
  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);

  const {
    refresh,
    isLoading,
    isEmpty,
    isCommunityEmpty,
    noRecommendedCommunities,
    noTrendingCommunities,
    error,
  } = useExplore();

  if (error != null) {
    return <ExploreError />;
  }

  if (isEmpty) {
    return <ExploreEmpty pageId={pageId} />;
  }

  if (isCommunityEmpty) {
    return <ExploreCommunityEmpty pageId={pageId} />;
  }

  return (
    <div
      className={styles.explore}
      onDrag={(event) => event.stopPropagation()}
      onTouchStart={(ev) => {
        touchStartY.current = ev.touches[0].clientY;
      }}
      onTouchMove={(ev) => {
        const touchY = ev.touches[0].clientY;

        if (touchStartY.current > touchY) {
          return;
        }

        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
      }}
      onTouchEnd={(ev) => {
        touchStartY.current = 0;
        if (touchDiff >= 75) {
          refresh();
        }
        setTouchDiff(0);
      }}
    >
      <div
        style={
          {
            '--asc-pull-to-refresh-height': `${touchDiff}px`,
          } as React.CSSProperties
        }
        className={styles.explore__pullToRefresh}
      >
        <RefreshSpinner className={styles.explore__pullToRefresh__spinner} />
      </div>
      <div className={styles.explore__divider} />
      <div className={styles.explore__exploreCategories}>
        <ExploreCommunityCategories pageId={pageId} />
      </div>
      {isLoading ? <div className={styles.explore__divider} /> : null}
      {noRecommendedCommunities === false ? (
        <div className={styles.explore__recommendedForYou} data-is-loading={isLoading === true}>
          {isLoading ? null : <ExploreRecommendedTitle pageId={pageId} />}
          <RecommendedCommunities pageId={pageId} />
        </div>
      ) : null}
      {isLoading ? <div className={styles.explore__divider} /> : null}
      {noTrendingCommunities === false ? (
        <div className={styles.explore__trendingNow}>
          {isLoading ? (
            <div className={styles.explore__trendingTitleSkeleton} />
          ) : (
            <ExploreTrendingTitle pageId={pageId} />
          )}
          <TrendingCommunities pageId={pageId} />
        </div>
      ) : null}
    </div>
  );
}
