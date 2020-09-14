import React from 'react';
import { customizableComponent } from 'hocs/customization';

import { EmptyFeedContainer, FeedIcon } from './styles';

const EmptyFeed = ({ className }) => (
  <EmptyFeedContainer className={className}>
    <FeedIcon />
    Your feed is empty. Add you first post
  </EmptyFeedContainer>
);

export default customizableComponent('EmptyFeed', EmptyFeed);
