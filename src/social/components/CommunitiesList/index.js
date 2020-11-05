import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import UICommunitiesList from './UICommunitiesList';

const CommunitiesList = ({
  className,
  communitiesQueryParam,
  onClickCommunity,
  activeCommunity,
}) => {
  const [communities, hasMore, loadMore] = useCommunitiesList(communitiesQueryParam);

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
      activeCommunity={activeCommunity}
      onClickCommunity={onClickCommunity}
      isSearchList={isSearchList}
      searchInput={searchInput}
      className={className}
    />
  );
};

CommunitiesList.propTypes = {
  className: PropTypes.string,
  communitiesQueryParam: PropTypes.object,
  activeCommunity: PropTypes.string,
  onClickCommunity: PropTypes.func,
};

CommunitiesList.defaultProps = {
  className: null,
  communitiesQueryParam: {},
  activeCommunity: '',
  onClickCommunity: () => {},
};

export { UICommunitiesList };
export default CommunitiesList;
