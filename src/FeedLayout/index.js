import React from 'react';
import { customizableComponent } from '../hoks/customization';

import { LayoutContainer, FeedWrapper } from './styles';

const FeedLayout = ({ sideMenu, children }) => {
  return (
    <LayoutContainer>
      {sideMenu}
      {children}
    </LayoutContainer>
  );
};

export default customizableComponent('FeedLayout')(FeedLayout);
