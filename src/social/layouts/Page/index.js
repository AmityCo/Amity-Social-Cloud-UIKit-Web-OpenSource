import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;

  grid-template-areas: 'side' 'main';
  grid-template-rows: min-content auto;

  ${({ withHeader }) =>
    withHeader &&
    `
    grid-template-areas: 'header' 'side' 'main';
  `}

  @media (min-width: 960px) {
    grid-template-areas: 'main side';
    grid-template-columns: auto min-content;
    ${({ withHeader }) => withHeader && `grid-template-areas: 'header header' 'main side';`}
  }

  width: 100%;
  height: 100%;
  grid-gap: 20px;
  overflow: hidden;
  margin: 0 auto;
`;

const HeaderContainer = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
`;

const Main = styled.div`
  grid-area: main;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Side = styled.div`
  grid-area: side;
  width: 100%;
  height: 100%;
  overflow: auto;

  @media (min-width: 960px) {
    width: 250px;
  }

  & > :not(:first-child) {
    margin-top: 20px;
  }
`;

const PageLayout = ({ header, aside, children }) => (
  <Container withHeader={!!header}>
    {header && <HeaderContainer>{header}</HeaderContainer>}
    <Main>{children}</Main>
    <Side>{aside}</Side>
  </Container>
);

PageLayout.propTypes = {
  children: PropTypes.node,
  aside: PropTypes.node,
  header: PropTypes.node,
};

PageLayout.defaultProps = {
  header: null,
};

export default PageLayout;
