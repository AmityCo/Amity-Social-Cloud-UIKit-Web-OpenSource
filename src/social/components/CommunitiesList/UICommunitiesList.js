import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommunityHeader from '~/social/components/CommunityHeader';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { LoadMoreButton, ShevronDownIcon } from './styles';

const UICommunityList = ({
  communityIds,
  loadMore,
  hasMore,
  getIsCommunityActive,
  onClickCommunity,
  isSearchList,
  searchInput,
  className,
}) => (
  <InfiniteScroll
    className={className}
    dataLength={communityIds.length}
    next={loadMore}
    hasMore={hasMore}
    loader={<h4>Loading...</h4>}
  >
    {communityIds.map(communityId => {
      const isActive = getIsCommunityActive(communityId);
      return (
        <CommunityHeader
          key={communityId}
          communityId={communityId}
          isActive={isActive}
          onClick={onClickCommunity}
          isSearchResult={isSearchList}
          searchInput={searchInput}
        />
      );
    })}
    <ConditionalRender condition={hasMore}>
      <LoadMoreButton onClick={loadMore}>
        Load more <ShevronDownIcon />
      </LoadMoreButton>
    </ConditionalRender>
  </InfiniteScroll>
);

const noop = () => {};

UICommunityList.propTypes = {
  communityIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClickCommunity: PropTypes.func,
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  getIsCommunityActive: PropTypes.func,
  isSearchList: PropTypes.bool,
  searchInput: PropTypes.string,
  className: PropTypes.string,
};

UICommunityList.defaultProps = {
  onClickCommunity: noop,
  loadMore: noop,
  hasMore: false,
  getIsCommunityActive: () => false,
  isSearchList: false,
  searchInput: '',
  className: null,
};

export default UICommunityList;
