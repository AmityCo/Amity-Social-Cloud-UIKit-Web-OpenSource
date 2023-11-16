import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UICommunitiesList from './UICommunitiesList';

const CommunitiesList = ({ className, communitiesQueryParam, activeCommunity }) => {
  const { onClickCommunity } = useNavigation();
  const [communities, hasMore, loadMore, loading, loadingMore] =
    useCommunitiesList(communitiesQueryParam);

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
      isSearchList={isSearchList}
      searchInput={searchInput}
      className={className}
      loading={loading}
      loadingMore={loadingMore}
      onClickCommunity={onClickCommunity}
    />
  );
};

CommunitiesList.propTypes = {
  className: PropTypes.string,
  communitiesQueryParam: PropTypes.object,
  activeCommunity: PropTypes.string,
};

CommunitiesList.defaultProps = {
  className: null,
  communitiesQueryParam: {},
  activeCommunity: '',
};

export { UICommunitiesList };
export default memo(CommunitiesList);
