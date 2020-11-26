import React from 'react';
import PropTypes from 'prop-types';
import { Grid, ListContainer } from './styles';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PaginatedList from '~/core/components/PaginatedList';
import EmptyState from '~/core/components/EmptyState';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import CommunityCard from '~/social/components/community/Card';

const CategoryCommunitiesList = ({ categoryId, onClickCommunity }) => {
  const [communities, hasMore, loadMore] = useCommunitiesList({ categoryId });

  return (
    <ListContainer>
      <PaginatedList
        items={communities}
        hasMore={hasMore}
        loadMore={loadMore}
        container={Grid}
        emptyState={
          <EmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title="It's empty here..."
            description="No community found in this category"
          />
        }
      >
        {({ communityId }) => (
          <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
        )}
      </PaginatedList>
    </ListContainer>
  );
};

CategoryCommunitiesList.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onClickCommunity: PropTypes.func,
};

CategoryCommunitiesList.defaultProps = {
  onClickCommunity: () => {},
};

export default CategoryCommunitiesList;
