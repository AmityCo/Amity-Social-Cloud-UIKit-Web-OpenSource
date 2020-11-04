import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import useTrendingCommunitiesList from '~/social/hooks/useTrendingCommunitiesList';
import Card from '~/core/components/Card';
import TrendingItem from '~/social/components/community/TrendingItem';

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

const TrendingList = ({ onClickCommunity }) => {
  const [communities] = useTrendingCommunitiesList();
  const { formatMessage } = useIntl();
  return (
    <Card title={formatMessage({ id: 'todaysTrendingTitle' })}>
      <CommunitiesList>
        {/* Only take first 5 communities even if BE returns more */}
        {communities.slice(0, 5).map(({ communityId }, index) => (
          <li key={communityId}>
            <TrendingItem
              communityId={communityId}
              trendingNumber={index + 1}
              onClick={onClickCommunity}
            />
          </li>
        ))}
      </CommunitiesList>
    </Card>
  );
};

TrendingList.propTypes = {
  onClickCommunity: PropTypes.func,
};

TrendingList.defaultProps = {
  onClickCommunity: () => {},
};

export default TrendingList;
