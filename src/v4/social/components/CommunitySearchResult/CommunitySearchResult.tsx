import React, { useRef } from 'react';
import styles from './CommunitySearchResult.module.css';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunityItem } from './CommunityItem';
import { CommunityItemSkeleton } from './CommunityItemSkeleton';

interface CommunitySearchResultProps {
  pageId?: string;
  communityCollection: Amity.Community[];
  isLoading: boolean;
  onLoadMore: () => void;
}

export const CommunitySearchResult = ({
  pageId = '*',
  communityCollection = [],
  // isLoading,
  onLoadMore,
}: CommunitySearchResultProps) => {
  const componentId = 'community_search_result';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const intersectionRef = useRef<HTMLDivElement>(null);

  const isLoading = true;

  useIntersectionObserver({ onIntersect: () => onLoadMore(), ref: intersectionRef });

  return (
    <div className={styles.communitySearchResult} style={themeStyles}>
      {communityCollection.map((community: Amity.Community) => (
        <CommunityItem
          key={community.communityId}
          community={community}
          pageId={pageId}
          componentId={componentId}
        />
      ))}
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <CommunityItemSkeleton key={index} pageId={pageId} componentId={componentId} />
          ))
        : null}
      <div ref={intersectionRef} />
    </div>
  );
};
