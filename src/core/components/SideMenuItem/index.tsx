import React, { ReactNode } from 'react';
import { IconWrapper, SideMenuItemContainer } from './styles';

export interface SideMenuItemProps {
  icon?: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const SideMenuItem = ({
  icon,
  children,
  active,
  className,
  onClick,
  ...otherProps
}: SideMenuItemProps) => (
  <SideMenuItemContainer className={className} active={active} onClick={onClick} {...otherProps}>
    {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
    {children}
  </SideMenuItemContainer>
);

export default SideMenuItem;
