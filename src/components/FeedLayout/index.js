import React from 'react';
import { customizableComponent } from '../../hocs/customization';

import { LayoutContainer } from './styles';

const FeedLayout = ({ sideMenu, children }) => {
  return (
    <LayoutContainer>
      {sideMenu}
      {children}
    </LayoutContainer>
  );
};

export default customizableComponent('FeedLayout')(FeedLayout);
