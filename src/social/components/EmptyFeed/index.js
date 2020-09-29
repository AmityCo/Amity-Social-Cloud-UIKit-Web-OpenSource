import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';
import { customizableComponent } from '~/core/hocs/customization';
import { EmptyFeedContainer, FeedIcon } from './styles';

const FeedTypesEmptyText = {
  [EkoPostTargetType.GlobalFeed]: 'This feed is empty',
  [EkoPostTargetType.CommunityFeed]: "This community's feed is empty",
  [EkoPostTargetType.UserFeed]: "This user's is empty",
  [EkoPostTargetType.MyFeed]: 'Your feed is empty. Add your first post',
};

const EmptyFeed = ({ targetType = EkoPostTargetType.MyFeed, className = null }) => (
  <EmptyFeedContainer className={className}>
    <FeedIcon />
    {FeedTypesEmptyText[targetType]}
  </EmptyFeedContainer>
);

EmptyFeed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(EkoPostTargetType)),
  className: PropTypes.string,
};

export default customizableComponent('EmptyFeed', EmptyFeed);
