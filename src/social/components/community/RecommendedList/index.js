import React from 'react';
import styled from 'styled-components';

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

const RecommendedList = ({ onClick }) => {
  const Title = <FormattedMessage id="recommendedList" />;

  const [communities] = useRecommendedCommunitiesList();

  return (
    <Card title={Title}>
      <HorizontalList>
        {communities.map(({ communityId }) => (
          <CommunityCard key={communityId} communityId={communityId} onClick={onClick} />
        ))}
      </HorizontalList>
    </Card>
  );
};

export default RecommendedList;
