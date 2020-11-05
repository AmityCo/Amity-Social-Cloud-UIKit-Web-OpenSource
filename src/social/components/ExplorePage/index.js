import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ExploreHeader from '~/social/components/ExploreHeader';
import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 1.5rem;
`;

const ExplorePage = ({ onClickCommunity, onCommunityCreated, onClickCategory }) => (
  <PageContainer>
    <ExploreHeader onClickCommunity={onClickCommunity} onCommunityCreated={onCommunityCreated} />
    <RecommendedList onClick={onClickCommunity} />
    <TrendingList onClickCommunity={onClickCommunity} />
    <CategoriesCard onClick={onClickCategory} />
  </PageContainer>
);

ExplorePage.defaultProps = {
  onClickCommunity: () => {},
  onCommunityCreated: () => {},
  onClickCategory: () => {},
};

ExplorePage.propTypes = {
  onClickCommunity: PropTypes.func,
  onCommunityCreated: PropTypes.func,
  onClickCategory: PropTypes.func,
};

export default ExplorePage;
