import React from 'react';
import styles from './styles.module.css';

export const ALLOWED_ELEMENTS = ['button', 'a'];

interface SideMenuActionItemProps {
  'data-testid'?: string;
  element?: 'button' | 'a';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const SideMenuActionItem = ({
  'data-testid': dataQaAnchor = '',
  icon,
  children,
  active,
  className,
  onClick,
  element = 'a',
  disabled,
}: SideMenuActionItemProps) => {
  if (element === 'a') {
    return (
      <a
        data-testid={dataQaAnchor}
        className={`${styles.anchorActionItem} ${active ? styles.active : ''} ${className || ''}`}
        onClick={onClick}
      >
        {icon && (
          <div className={`${styles.iconWrapper} ${active ? styles.active : ''}`}>{icon}</div>
        )}
        <span className={styles.actionItemChild}>{children}</span>
      </a>
    );
  }

  return (
    <button
      data-testid={dataQaAnchor}
      className={`${styles.buttonActionItem} ${active ? styles.active : ''} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <div className={`${styles.iconWrapper} ${active ? styles.active : ''}`}>{icon}</div>}
      <span className={styles.actionItemChild}>{children}</span>
    </button>
  );
};

export default SideMenuActionItem;
