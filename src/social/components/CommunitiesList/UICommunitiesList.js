import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommunityHeader from '~/social/components/CommunityHeader';
import { LoadMore } from '~/social/components/LoadMore';

const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;

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
    // TODO - when infinite scroll is fixed: bring back loading component
    // and remove use of LoadMore button.
    loader={<div />}
  >
    <LoadMore hasMore={hasMore} loadMore={loadMore} className="no-border">
      {isSearchList && !communityIds.length && (
        <NoResultsMessage>No community found</NoResultsMessage>
      )}
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
    </LoadMore>
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
