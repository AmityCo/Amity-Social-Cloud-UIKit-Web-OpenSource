import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import Skeleton from '~/core/components/Skeleton';

import useTrendingCommunitiesList from '~/social/hooks/useTrendingCommunitiesList';
import TrendingItem from '~/social/components/community/TrendingItem';
import { useNavigation } from '~/social/providers/NavigationProvider';
import Title from '~/social/components/community/Title';

const CommunitiesList = styled.ul`
  list-style: none;
  counter-reset: trending;
  padding: 0;
  margin: 0;
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: 1fr;
  grid-gap: 16px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TrendingList = () => {
  const { onClickCommunity } = useNavigation();

  const [communities, , , loading] = useTrendingCommunitiesList();

  const title = loading ? (
    <Skeleton style={{ fontSize: 12, maxWidth: 156 }} />
  ) : (
    <FormattedMessage id="todaysTrendingTitle" />
  );

  const list = loading
    ? new Array(5).fill(1).map((x, index) => (
        <li key={index}>
          <TrendingItem loading />
        </li>
      ))
    : communities.slice(0, 5).map(({ communityId }) => (
        <li key={communityId}>
          <TrendingItem communityId={communityId} onClick={onClickCommunity} />
        </li>
      ));

  return (
    <div>
      <Title>{title}</Title>
      <CommunitiesList>{list}</CommunitiesList>
    </div>
  );
};

export default TrendingList;
