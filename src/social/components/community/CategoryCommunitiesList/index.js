import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PaginatedList from '~/core/components/PaginatedList';
import CommunityCard from '~/social/components/community/Card';

const ListContainer = styled.div`
  padding: 1rem;
  padding-right: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  background: ${({ theme }) => theme.palette.system.background};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  & > * {
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
  }
`;

const CategoryCommunitiesList = ({ categoryId, onClickCommunity }) => {
  const [communities, hasMore, loadMore] = useCommunitiesList({ categoryId });
  return (
    <ListContainer>
      <PaginatedList items={communities} hasMore={hasMore} loadMore={loadMore} container={Grid}>
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
