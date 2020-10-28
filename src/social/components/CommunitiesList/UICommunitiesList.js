import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CommunityHeader from '~/social/components/CommunityHeader';
import ConditionalRender from '~/core/components/ConditionalRender';
import { LoadMore } from '~/social/components/LoadMore';
import { CommunityScrollContainer } from './styles';

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
    </CommunityScrollContainer>
  );
};

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
