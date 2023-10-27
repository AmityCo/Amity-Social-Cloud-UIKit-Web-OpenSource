import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// TODO - confirm colour with design
const SectionContainer = styled.div`
  border-top: 1px solid #f7f7f8;
  padding: 0 8px;
`;

const ListHeading = styled.h4`
  ${({ theme }) => theme.typography.title};
  padding: 0 8px;
  margin: 1em 0;
  color: ${({ theme }) => theme.palette.title.shade1};
`;

const SideMenuSection = ({ heading, children }) => (
  <SectionContainer>
    {heading && <ListHeading>{heading}</ListHeading>}
    {children}
  </SectionContainer>
);

SideMenuSection.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
};

export default SideMenuSection;
