import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';
import { customizableComponent } from '~/core/hocs/customization';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { EmptyFeedContainer, FeedIcon, ExploreLink, SearchIcon, Text } from './styles';

// TODO: react-intl
const FeedTypesEmptyText = {
  [EkoPostTargetType.GlobalFeed]: 'This feed is empty',
  [EkoPostTargetType.CommunityFeed]: "This community's feed is empty",
  [EkoPostTargetType.UserFeed]: "This user's feed is empty",
  [EkoPostTargetType.MyFeed]: 'Your feed is empty. Add your first post',
};

const EmptyFeed = ({
  targetType = EkoPostTargetType.MyFeed,
  className = null,
  emptyFeedIcon,
  goToExplore,
}) => (
  <EmptyFeedContainer className={className}>
    <ConditionalRender condition={emptyFeedIcon}>
      {emptyFeedIcon}
      <FeedIcon />
    </ConditionalRender>
    <Text>{FeedTypesEmptyText[targetType]}</Text>
    <ConditionalRender condition={goToExplore}>
      <div>
        <ExploreLink onClick={goToExplore}>
          <SearchIcon />
          Explore Community
        </ExploreLink>
      </div>
    </ConditionalRender>
  </EmptyFeedContainer>
);

EmptyFeed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(EkoPostTargetType)),
  className: PropTypes.string,
  emptyFeedIcon: PropTypes.object,
  goToExplore: PropTypes.func,
};

export default customizableComponent('EmptyFeed', EmptyFeed);
