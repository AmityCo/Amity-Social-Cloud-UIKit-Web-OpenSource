import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PageWrapper = styled.div`
  width: 100%;
  padding: 24px 78px 0;
  overflow-y: auto;
  display: flex;
`;

const PageMain = styled.div`
  margin-right: 16px;
  width: 100%;
  flex-shrink: 1;
`;

const ProfilePageLayout = ({ profileInfo, children }) => (
  <PageWrapper>
    <PageMain>{children}</PageMain>
    {profileInfo}
  </PageWrapper>
);

ProfilePageLayout.propTypes = {
  children: PropTypes.node,
  profileInfo: PropTypes.node,
};

export default ProfilePageLayout;
