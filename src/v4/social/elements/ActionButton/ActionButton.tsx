import React from 'react';
import clsx from 'clsx';
import styles from './ActionButton.module.css';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, className, ...rest }) => {
  return (
    <button className={clsx(styles.actionButton, className)} {...rest}>
      {icon}
    </button>
  );
};
