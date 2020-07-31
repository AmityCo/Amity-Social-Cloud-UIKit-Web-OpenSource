import React from 'react';
import { IconWrapper, SideMenuItemContainer } from './styles';

const SideMenuItem = ({ icon, children, ...props }) => (
  <SideMenuItemContainer {...props}>
    {icon && <IconWrapper>{icon}</IconWrapper>}
    {children}
  </SideMenuItemContainer>
);

export default SideMenuItem;
