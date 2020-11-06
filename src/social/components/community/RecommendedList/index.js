/* eslint-disable react/jsx-no-useless-fragment */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import Card from '~/core/components/Card';
import HorizontalList from '~/core/components/HorizontalList';
import UiKitCommunityCard from '~/social/components/community/Card';
import CommunityHeader from '~/social/components/community/Header';

import useRecommendedCommunitiesList from '~/social/hooks/useRecommendedCommunitiesList';

const CommunityCard = styled(UiKitCommunityCard)`
  &:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

const Notes = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
`;

const Category = styled.span`
  font: inherit;

  &:after {
    content: ' • ';
  }
`;

const RecommendedList = ({ slim, onClickCommunity }) => {
  const Title = <FormattedMessage id="recommendedList" />;

  const [communities] = useRecommendedCommunitiesList();

  return (
    <Card title={Title} slim={slim}>
      <ConditionalRender condition={!slim}>
        <HorizontalList>
          {communities.map(({ communityId }) => (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          ))}
        </HorizontalList>
      </ConditionalRender>

      <ConditionalRender condition={slim}>
        <>
          {communities.map(({ communityId }) => (
            <CommunityHeader key={communityId} communityId={communityId} onClick={onClickCommunity}>
              {({ community, communityCategories }) => (
                <Notes>
                  {communityCategories.map(({ categoryId, name }) => (
                    <Category key={categoryId}>{name}</Category>
                  ))}
                  {toHumanString(community.membersCount)}{' '}
                  <FormattedMessage
                    id="plural.member"
                    values={{ amount: community.membersCount }}
                  />
                </Notes>
              )}
            </CommunityHeader>
          ))}
        </>
      </ConditionalRender>
    </Card>
  );
};

RecommendedList.propTypes = {
  slim: PropTypes.bool,
  onClickCommunity: PropTypes.func,
};

export default RecommendedList;
