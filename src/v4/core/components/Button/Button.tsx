import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  context?: 'default' | 'registration';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'default';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  context = 'default',
  variant = 'primary',
  size = 'default',
  icon,
  className,
  ...rest
}) => {
  const buttonClassName = clsx(
    styles.button,
    styles[context],
    styles[variant],
    styles[size],
    className,
  );

  return (
    <button className={buttonClassName} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
