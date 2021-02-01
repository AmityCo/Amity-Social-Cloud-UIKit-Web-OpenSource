import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CommunityHeader from '~/social/components/community/Header';
import ConditionalRender from '~/core/components/ConditionalRender';
import LoadMore from '~/social/components/LoadMore';
import { CommunityScrollContainer } from './styles';

const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;

const UICommunityList = ({
  className,
  communityIds,
  loadMore,
  hasMore,
  activeCommunity,
  onClickCommunity,
  isSearchList,
  searchInput,
}) => {
  const noCommunitiesFound = isSearchList && !communityIds.length;
  const classNames = [communityIds.length < 4 && 'no-scroll', className].filter(Boolean).join(' ');

  return (
    <CommunityScrollContainer
      className={classNames}
      dataLength={communityIds.length}
      next={loadMore}
      hasMore={hasMore}
      // TODO - when infinite scroll is fixed: bring back loading component
      // and remove use of LoadMore button.
      loader={<div />}
    >
      <LoadMore hasMore={hasMore} loadMore={loadMore} className="no-border">
        <ConditionalRender condition={noCommunitiesFound}>
          <NoResultsMessage>No community found</NoResultsMessage>
        </ConditionalRender>
        {communityIds.map(communityId => (
          <CommunityHeader
            key={communityId}
            communityId={communityId}
            isActive={communityId === activeCommunity}
            onClick={onClickCommunity}
            isSearchResult={isSearchList}
            searchInput={searchInput}
          />
        ))}
      </LoadMore>
    </CommunityScrollContainer>
  );
};

UICommunityList.propTypes = {
  className: PropTypes.string,
  communityIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  activeCommunity: PropTypes.string,
  onClickCommunity: PropTypes.func,
  isSearchList: PropTypes.bool,
  searchInput: PropTypes.string,
};

UICommunityList.defaultProps = {
  className: null,
  loadMore: () => {},
  hasMore: false,
  activeCommunity: '',
  onClickCommunity: () => {},
  isSearchList: false,
  searchInput: '',
};

export default UICommunityList;
