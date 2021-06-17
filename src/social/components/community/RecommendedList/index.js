/* eslint-disable react/jsx-no-useless-fragment */

import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';

import Card from '~/core/components/Card';
import HorizontalList from '~/core/components/HorizontalList';
import Skeleton from '~/core/components/Skeleton';
import UiKitCommunityCard from '~/social/components/community/Card';
import CommunityHeader from '~/social/components/community/Header';

import useRecommendedCommunitiesList from '~/social/hooks/useRecommendedCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';

const CommunityCard = styled(UiKitCommunityCard)`
  &:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

const Notes = styled.div`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.shade1};
`;

const Category = styled.span`
  font: inherit;

  &:after {
    content: ' • ';
  }
`;

const RecommendedList = ({ slim }) => {
  const { onClickCommunity } = useNavigation();
  const [communities, , , loading] = useRecommendedCommunitiesList();

  const title = loading ? (
    <Skeleton style={{ fontSize: 12, maxWidth: 156 }} />
  ) : (
    <FormattedMessage id="recommendedList" />
  );

  return (
    <Card title={title} slim={slim}>
      {!slim && (
        <HorizontalList>
          {loading && new Array(4).fill(1).map((x, index) => <CommunityCard key={index} loading />)}

          {!loading &&
            communities.map(({ communityId }) => (
              <CommunityCard
                key={communityId}
                communityId={communityId}
                onClick={onClickCommunity}
              />
            ))}
        </HorizontalList>
      )}

      {slim &&
        loading &&
        new Array(5).fill(1).map((x, index) => (
          <CommunityHeader key={index} loading>
            <Skeleton style={{ fontSize: 8, maxWidth: 88 }} />
          </CommunityHeader>
        ))}

      {slim &&
        !loading &&
        communities.map(({ communityId }) => (
          <CommunityHeader key={communityId} communityId={communityId} onClick={onClickCommunity}>
            {({ community, communityCategories }) => (
              <Notes>
                {communityCategories.map(({ categoryId, name }) => (
                  <Category key={categoryId}>{name}</Category>
                ))}
                {toHumanString(community.membersCount)}{' '}
                <FormattedMessage id="plural.member" values={{ amount: community.membersCount }} />
              </Notes>
            )}
          </CommunityHeader>
        ))}
    </Card>
  );
};

RecommendedList.propTypes = {
  slim: PropTypes.bool,
};

export default memo(RecommendedList);
