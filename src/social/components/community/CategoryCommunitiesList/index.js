import { CommunitySortingMethod } from '@amityco/js-sdk';
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { Grid, ListContainer, ListEmptyState } from './styles';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PaginatedList from '~/core/components/PaginatedList';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import CommunityCard from '~/social/components/community/Card';

const CategoryCommunitiesList = ({ categoryId }) => {
  const { onClickCommunity } = useNavigation();
  const [communities, hasMore, loadMore, loading, loadingMore] = useCommunitiesList({
    categoryId,
    sortBy: CommunitySortingMethod.DisplayName,
  });

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ communityId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return communities;
    }

    return [...communities, ...getLoadingItems()];
  }, [communities, loading, loadingMore]);

  return (
    <ListContainer>
      <PaginatedList
        items={items}
        hasMore={hasMore}
        loadMore={loadMore}
        container={Grid}
        emptyState={
          <ListEmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title="It's empty here..."
            description="No community found in this category"
          />
        }
      >
        {({ communityId, skeleton }) =>
          skeleton ? (
            <CommunityCard key={communityId} loading />
          ) : (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          )
        }
      </PaginatedList>
    </ListContainer>
  );
};

CategoryCommunitiesList.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default memo(CategoryCommunitiesList);
