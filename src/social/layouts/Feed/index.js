import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-areas: 'feed info';
  grid-template-columns: auto min-content;
  width: 100%;
  height: 100%;
  grid-gap: 20px;
  overflow: hidden;
  margin: 0 auto;
  padding: 20px 0;
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Side = styled.div`
  width: 100%;
  height: 100%;
  max-width: 20rem;
  overflow: auto;

  & > :not(:first-child) {
    margin-top: 20px;
  }
`;

const FeedLayout = ({ aside, children }) => (
  <Container>
    <Main>{children}</Main>
    <Side>{aside}</Side>
  </Container>
);

FeedLayout.propTypes = {
  children: PropTypes.node,
  aside: PropTypes.node,
};

export default FeedLayout;
