import React from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

const Container = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas: 'side main' 'none main';
  grid-template-columns: min-content auto;
  grid-template-rows: 100%;
  grid-gap: 0 20px;
  width: 100%;
  height: 100%;
  padding-right: 20px;
  background: #f7f7f8;
  @media screen and (min-width: 1512px) {
    padding-right: 0;
  }
`;

const Main = styled.div`
  grid-area: main;
  overflow: auto;
  width: 100%;
  min-width: 20rem;
  max-width: 90.75rem;
  margin: 0 auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Side = styled.div`
  grid-area: side;
  overflow: auto;
`;

const Layout = ({ aside, children }) => {
  return (
    <Container id="main-container">
      <Main>{children}</Main>
      <Side>{aside}</Side>
    </Container>
  );
};

export default customizableComponent('Layout', Layout);
