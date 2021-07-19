import React from 'react';
import { IconWrapper, SideMenuItemContainer } from './styles';

const SideMenuItem = ({ icon, children, active, className, onClick, ...otherProps }) => (
  <SideMenuItemContainer onClick={onClick} className={className} active={active} {...otherProps}>
    {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
    {children}
  </SideMenuItemContainer>
);

export default SideMenuItem;
