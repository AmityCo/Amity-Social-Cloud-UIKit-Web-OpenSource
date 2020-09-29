import React from 'react';
import Tabs from '~/core/components/Tabs';
import { customizableComponent } from '~/core/hocs/customization';

import { UserFeedHeaderContainer } from './styles';

const UserFeedHeader = ({ className }) => {
  return (
    <UserFeedHeaderContainer className={className}>
      <Tabs tabs={{ tl: 'Timeline' }} activeTab="tl" />
    </UserFeedHeaderContainer>
  );
};

export default customizableComponent('UserFeedHeader', UserFeedHeader);
