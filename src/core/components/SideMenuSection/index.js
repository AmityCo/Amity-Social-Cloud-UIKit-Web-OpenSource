import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// TODO - confirm colour with design
const SectionContainer = styled.div`
  border-top: 1px solid #f7f7f8;
  padding: 0.5rem 0 0.5em;
`;

export const ListHeading = styled.h4`
  ${({ theme }) => theme.typography.title};
  padding: 0.5rem 0.8rem;
  margin: 0 0 0.5rem;
  border-bottom: 1px solid #f7f7f8;
  flex-direction: row;
  align-items: center;
  display: inline-flex;
  width: 100%;
  font-size: 0.9rem !important;
`;

const SideMenuSection = ({ heading, icon, children }) => (
  <SectionContainer>
    {(heading || icon) && (
      <ListHeading>
        {icon} {heading}
      </ListHeading>
    )}
    {children}
  </SectionContainer>
);

SideMenuSection.propTypes = {
  heading: PropTypes.node,
  children: PropTypes.node,
};

export default SideMenuSection;
