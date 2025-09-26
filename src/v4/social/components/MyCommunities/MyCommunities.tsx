import React from 'react';
import { GenericSearchResult } from '~/v4/social/components/GenericSearchResult/';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

import styles from './MyCommunities.module.css';

interface MyCommunitiesProps {
  pageId?: string;
}

export const MyCommunities = ({ pageId = '*' }: MyCommunitiesProps) => {
  const componentId = 'my_communities';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  return (
    <div style={themeStyles} className={styles.myCommunitiesList}>
      <GenericSearchResult
        pageId={pageId}
        type="community"
        collection={communities}
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
