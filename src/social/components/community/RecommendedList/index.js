import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Card from '~/core/components/Card';
import HorizontalList from '~/core/components/HorizontalList';
import UiKitCommunityCard from '~/social/components/community/Card';

import useRecommendedCommunitiesList from '~/social/hooks/useRecommendedCommunitiesList';

const CommunityCard = styled(UiKitCommunityCard)`
  &:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

const RecommendedList = ({ onClickCommunity }) => {
  const Title = <FormattedMessage id="recommendedList" />;

  const [communities] = useRecommendedCommunitiesList();

  return (
    <Card title={Title}>
      <HorizontalList>
        {communities.map(({ communityId }) => (
          <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
        ))}
      </HorizontalList>
    </Card>
  );
};

RecommendedList.propTypes = {
  onClickCommunity: PropTypes.func,
};

export default RecommendedList;
