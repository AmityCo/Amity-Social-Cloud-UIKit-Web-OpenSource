import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: grid;
  grid-template-areas: 'feed info' 'feed none';
  grid-template-columns: auto min-content;
  grid-template-rows: min-content auto;
  margin: 0 auto;
`;

const PageMain = styled.div`
  width: 100%;
  flex-shrink: 1;
`;

const PageSide = styled.div`
  padding: 20px;
  padding-right: 0;
`;

const ProfilePageLayout = ({ profileInfo, children }) => (
  <PageWrapper>
    <PageMain>{children}</PageMain>
    <PageSide>{profileInfo}</PageSide>
  </PageWrapper>
);

ProfilePageLayout.propTypes = {
  children: PropTypes.node,
  profileInfo: PropTypes.node,
};

export default ProfilePageLayout;
