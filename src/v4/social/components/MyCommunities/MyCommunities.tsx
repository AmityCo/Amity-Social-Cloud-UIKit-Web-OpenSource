import React from 'react';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult/';
import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

import styles from './MyCommunities.module.css';

interface MyCommunitiesProps {
  pageId?: string;
}

export const MyCommunities = ({ pageId = '*' }: MyCommunitiesProps) => {
  const componentId = 'my_communities';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const { communities, isLoading, error, hasMore, loadMore } = useCommunitiesCollection({
    membership: 'member',
  });

  return (
    <div style={themeStyles} className={styles.myCommunitiesList}>
      <CommunitySearchResult
        pageId={pageId}
        communityCollection={communities}
        isLoading={isLoading}
        onLoadMore={() => {
          if (hasMore && isLoading === false) {
            loadMore();
          }
        }}
      />
    </div>
  );
};
