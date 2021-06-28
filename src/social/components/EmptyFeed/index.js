import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { PostTargetType } from '@amityco/js-sdk';

import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import EmptyState from '~/core/components/EmptyState';
import Button from '~/core/components/Button';
import { NewspaperLight, Search } from '~/icons';

const FeedIcon = styled(NewspaperLight)`
  font-size: 48px;
  margin: 10px;
`;

const ExploreLink = styled(Button)`
  font-size: 14px;
  margin-top: 8px;
`;

const SearchIcon = styled(Search)`
  font-size: 16px;
  margin-right: 6px;
`;

const FeedTypesEmptyText = {
  [PostTargetType.GlobalFeed]: () => 'feed.emptyFeed',
  [PostTargetType.CommunityFeed]: canPost =>
    canPost ? 'feed.emptyJoinedCommunityFeed' : 'feed.emptyCommunityFeed',
  [PostTargetType.UserFeed]: () => 'feed.emptyUserFeed',
  [PostTargetType.MyFeed]: () => 'feed.emptyMyFeed',
};

const EmptyFeed = ({
  targetType = PostTargetType.MyFeed,
  canPost = false,
  className = null,
  goToExplore,
}) => (
  <EmptyState
    className={className}
    title={<FormattedMessage id={FeedTypesEmptyText[targetType]?.(canPost) || 'feed.emptyFeed'} />}
    icon={<FeedIcon />}
  >
    {goToExplore && (
      <ExploreLink onClick={goToExplore}>
        <SearchIcon />
        <FormattedMessage id="community.exploreCommunities" />
      </ExploreLink>
    )}
  </EmptyState>
);

EmptyFeed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  canPost: PropTypes.bool,
  className: PropTypes.string,
  goToExplore: PropTypes.func,
};

export default customizableComponent('EmptyFeed', EmptyFeed);
