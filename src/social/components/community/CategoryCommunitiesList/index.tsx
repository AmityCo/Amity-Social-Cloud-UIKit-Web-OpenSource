import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useNavigation } from '~/social/providers/NavigationProvider';
import { Grid, ListEmptyState } from './styles';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import CommunityCard, { UICommunityCard } from '~/social/components/community/Card';
import { isLoadingItem } from '~/utils';
import Button from '~/core/components/Button';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';

interface CategoryCommunitiesListProps {
  categoryId: string;
}

const CategoryCommunitiesList = ({ categoryId }: CategoryCommunitiesListProps) => {
  const { onClickCommunity } = useNavigation();
  const { communities, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } =
    useCommunitiesCollection({
      categoryId,
      sortBy: 'displayName',
    });

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ communityId: index, skeleton: true }));
    }

    if (isLoading && !loadMoreHasBeenCalled) {
      return getLoadingItems();
    }

    if (isLoading && loadMoreHasBeenCalled) {
      return [...communities, ...getLoadingItems()];
    }
    return communities;
  }, [communities, isLoading, loadMoreHasBeenCalled]);

  if (items.length === 0) {
    return (
      <>
        <Grid>
          <ListEmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title={<FormattedMessage id="CategoryCommunitiesList.emptyTitle" />}
            description={<FormattedMessage id="CategoryCommunitiesList.emptyDescription" />}
          />
        </Grid>
        {loadMore && (
          <Button fullWidth onClick={loadMore}>
            <FormattedMessage id="loadMore" />
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <Grid>
        {items.map((community) =>
          isLoadingItem(community) ? (
            <UICommunityCard key={community?.communityId} loading />
          ) : (
            <CommunityCard
              key={community?.communityId}
              communityId={community.communityId}
              onClick={onClickCommunity}
            />
          ),
        )}
      </Grid>
      {loadMore && (
        <Button fullWidth onClick={loadMore}>
          <FormattedMessage id="loadMore" />
        </Button>
      )}
    </>
  );
};

export default memo(CategoryCommunitiesList);
