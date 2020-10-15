import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import UICommunitiesList from './UICommunitiesList';

const CommunitiesList = ({
  communitiesQueryParam,
  onClickCommunity,
  getIsCommunityActive,
  className,
}) => {
  const [communities, hasMore, loadMore] = useCommunitiesList(communitiesQueryParam, [
    communitiesQueryParam,
  ]);

  // If the list is the result of a search, then the list items are displayed differently.
  const isSearchList = communitiesQueryParam.hasOwnProperty('search');
  const searchInput = communitiesQueryParam?.search;

  const communityIds = useMemo(() => {
    if (!communities.length) return [];
    return communities.map(({ communityId }) => communityId);
  }, [communities]);

  return (
    <UICommunitiesList
      communityIds={communityIds}
      loadMore={loadMore}
      hasMore={hasMore}
      getIsCommunityActive={getIsCommunityActive}
      onClickCommunity={onClickCommunity}
      isSearchList={isSearchList}
      searchInput={searchInput}
      className={className}
    />
  );
};

CommunitiesList.propTypes = {
  // This prop shape should match the parameters to the SDK's allCommunitiesWithFilters function.
  communitiesQueryParam: PropTypes.shape({
    search: PropTypes.string,
    isJoined: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    sortBy: PropTypes.string,
  }),
  onClickCommunity: PropTypes.func,
  getIsCommunityActive: PropTypes.func,
  className: PropTypes.string,
};

CommunitiesList.defaultProps = {
  communitiesQueryParam: {},
  onClickCommunity: () => {},
  getIsCommunityActive: () => false,
  className: null,
};

export { UICommunitiesList };
export default CommunitiesList;
