import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Skeleton from '~/core/components/Skeleton';
import useTrendingCommunitiesList from '~/social/hooks/useTrendingCommunitiesList';
import Card from '~/core/components/Card';
import TrendingItem from '~/social/components/community/TrendingItem';
import { useNavigation } from '~/social/providers/NavigationProvider';

const CommunitiesList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  counter-reset: trending;

  &:after {
    content: ' ';
  }

  & > li {
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  & > li,
  &:after {
    flex: 1 1 calc(50% - 2rem);
    min-width: 20rem;
  }

  & > li:not(:last-child) {
    margin-bottom: 1rem;

    /* Bottom border that does not cover avatar and trending number widths. */
    ${({ theme }) => {
      const {
        palette: {
          system: { borders },
        },
      } = theme;

      return css`
        background-image: linear-gradient(${borders}, ${borders});
        background-size: calc(100% - 2rem - 64px) 1px;
        background-repeat: no-repeat;
        background-position: 100% 100%;
      `;
    }}
  }
`;

const TrendingList = ({ slim }) => {
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
          <TrendingItem slim={slim} loading />
        </li>
      ))
    : communities.slice(0, 5).map(({ communityId }) => (
        <li key={communityId}>
          <TrendingItem communityId={communityId} slim={slim} onClick={onClickCommunity} />
        </li>
      ));

  return (
    <Card title={title} slim={slim}>
      <CommunitiesList>{list}</CommunitiesList>
    </Card>
  );
};

TrendingList.propTypes = {
  slim: PropTypes.bool,
};

TrendingList.defaultProps = {
  slim: false,
};

export default TrendingList;
