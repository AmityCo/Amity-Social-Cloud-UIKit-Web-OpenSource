import React, { ReactNode } from 'react';
import styled from 'styled-components';

// TODO - confirm colour with design
const SectionContainer = styled.div`
  border-top: 1px solid #f7f7f8;
  padding: 0.5rem;
`;

const ListHeading = styled.h4`
  display: none;

  @media (min-width: 768px) {
    ${({ theme }) => theme.typography.title};
    padding: 0 8px;
    margin: 1em 0;
  }
`;

interface SideMenuSectionProps {
  heading?: ReactNode;
  children: ReactNode;
}

const SideMenuSection = ({ heading, children }: SideMenuSectionProps) => (
  <SectionContainer>
    {heading && <ListHeading>{heading}</ListHeading>}
    {children}
  </SectionContainer>
);

export default SideMenuSection;
