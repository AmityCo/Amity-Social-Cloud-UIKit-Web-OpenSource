import React, { ReactNode } from 'react';
import styles from './styles.module.css';

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
  <button
    className={`${styles.sideMenuItemContainer} ${active ? styles.active : ''} ${className || ''}`}
    onClick={onClick}
    {...otherProps}
  >
    {icon && <div className={`${styles.iconWrapper} ${active ? styles.active : ''}`}>{icon}</div>}
    {children}
  </button>
);

export default SideMenuItem;
