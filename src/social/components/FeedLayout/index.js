import React from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

const LayoutContainer = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas: 'side main' 'none main';
  grid-template-columns: min-content auto;
  grid-template-rows: 100%;
  grid-gap: 0 20px;
  width: 100%;
  height: 100%;
  padding: 0 20px 0 0;
  background: #f7f7f8;

  & .sidebar {
    grid-area: side;
    overflow: auto;
  }
`;

const Main = styled.div`
  grid-area: main;
  overflow: auto;
`;

const FeedLayout = ({ sideMenu, children }) => {
  const Sidebar = React.cloneElement(sideMenu, { className: 'sidebar' });

  return (
    <LayoutContainer>
      {Sidebar}
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default customizableComponent('FeedLayout', FeedLayout);
