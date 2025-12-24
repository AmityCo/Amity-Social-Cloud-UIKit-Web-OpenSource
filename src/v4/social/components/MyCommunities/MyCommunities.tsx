import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult/';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import CreateCommunityRowItem from '~/v4/social/internal-components/CreateCommunityRowItem';
import styles from './MyCommunities.module.css';

type MyCommunitiesProps = {
  pageId?: string;
};

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
      <CreateCommunityRowItem />
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
