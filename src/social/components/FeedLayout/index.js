import React from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

const LayoutContainer = styled.div`
  display: flex;
  background: #f7f7f8;
  overflow-y: scroll;
  & > *:nth-child(2) {
    width: 100%;
    padding: 10px;
  }
`;

const FeedLayout = ({ sideMenu, children }) => {
  return (
    <LayoutContainer>
      {sideMenu}
      {children}
    </LayoutContainer>
  );
};

export default customizableComponent('FeedLayout', FeedLayout);
