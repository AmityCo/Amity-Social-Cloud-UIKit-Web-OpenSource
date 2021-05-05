import React from 'react';
import PropTypes from 'prop-types';

import { PostTargetType } from '@amityco/js-sdk';

import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
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

// TODO: react-intl
const FeedTypesEmptyText = {
  [PostTargetType.GlobalFeed]: 'This feed is empty',
  [PostTargetType.CommunityFeed]: "This community's feed is empty",
  [PostTargetType.UserFeed]: "This user's feed is empty",
  [PostTargetType.MyFeed]: 'Your feed is empty. Start your first post',
};

const EmptyFeed = ({ targetType = PostTargetType.MyFeed, className = null, goToExplore }) => (
  <EmptyState className={className} title={FeedTypesEmptyText[targetType]} icon={<FeedIcon />}>
    <ConditionalRender condition={goToExplore}>
      <div>
        <ExploreLink onClick={goToExplore}>
          <SearchIcon />
          Explore Community
        </ExploreLink>
      </div>
    </ConditionalRender>
  </EmptyState>
);

EmptyFeed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  className: PropTypes.string,
  goToExplore: PropTypes.func,
};

export default customizableComponent('EmptyFeed', EmptyFeed);
