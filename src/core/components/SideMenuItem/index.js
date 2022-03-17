import React from 'react';
import { IconWrapper, SideMenuItemContainer } from './styles';

const SideMenuItem = ({ icon, children, active, className, onClick, ...otherProps }) => (
  <SideMenuItemContainer className={className} active={active} onClick={onClick} {...otherProps}>
    {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
    {children}
  </SideMenuItemContainer>
);

export default SideMenuItem;
