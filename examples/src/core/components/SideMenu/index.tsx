import React from 'react';
import styles from './styles.module.css';

interface SideMenuProps {
  children?: React.ReactNode;
  className?: string;
}

const SideMenu = ({ children, className }: SideMenuProps) => {
  return <div className={`${styles.sideMenu} ${className || ''}`}>{children}</div>;
};

export default SideMenu;
