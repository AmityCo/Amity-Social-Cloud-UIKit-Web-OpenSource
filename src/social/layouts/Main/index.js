import React from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

const Container = styled.div`
  overflow: hidden;
 
  grid-template-areas: 'side main' 'none main';
  grid-template-columns: min-content auto;
  grid-template-rows: 100%;
  grid-gap: 0 20px;
  width: 100%;
  height: 100%;
  // padding: 0 20px 0 0;
  background: #f7f7f8;

  @media (min-width: 600px) {
    display: grid;
  }
`;

const Main = styled.div`
  grid-area: main;
  overflow: auto;
  width: 100%;
  min-width: 20rem;
  // max-width: 90.75rem;
  margin: 0 auto;
`;

const Side = styled.div`
  grid-area: side;
  overflow: auto;

  @media (max-width: 600px) {
    display: none;
  }
`;

const Layout = ({ aside, children }) => {
  return (
    <Container>
      <Side>{aside}</Side>
      <Main>{children}</Main>
    </Container>
  );
};

export default customizableComponent('Layout', Layout);
