import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Grid, ListEmptyState } from './styles';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import CommunityCard, { UICommunityCard } from '~/social/components/community/Card';
import { useCategoryCommunitiesList } from './hook';
import { isLoadingItem } from '~/utils';
import LoadMore from '~/core/components/LoadMore';

type UICategoryCommunitiesListProps = ReturnType<typeof useCategoryCommunitiesList> & {
  category: Amity.Category;
};

const UICategoryCommunitiesList = ({
  category,
  communities,
  hasMore,
  loadMore,
  isLoading,
  onClickCommunity,
}: UICategoryCommunitiesListProps) => {
  const renderLoadMore = () => {
    if (!hasMore) return null;

    return <LoadMore onClick={() => loadMore()} />;
  };

  if (communities.length === 0) {
    return (
      <>
        <Grid>
          <ListEmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title={<FormattedMessage id="CategoryCommunitiesList.emptyTitle" />}
            description={<FormattedMessage id="CategoryCommunitiesList.emptyDescription" />}
          />
        </Grid>
        {renderLoadMore()}
      </>
    );
  }

  return (
    <>
      <Grid>
        {communities.map((community, index) =>
          isLoadingItem(community) ? (
            <UICommunityCard key={index} loading />
          ) : (
            <CommunityCard
              key={community?.communityId}
              communityId={community?.communityId}
              onClick={onClickCommunity}
            />
          ),
        )}
      </Grid>
      {renderLoadMore()}
    </>
  );
};

export default UICategoryCommunitiesList;
