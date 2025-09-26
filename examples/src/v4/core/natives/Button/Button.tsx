import React from 'react';
import clsx from 'clsx';
import { Button as ReactAriaButton } from 'react-aria-components';
import styles from './Button.module.css';

export type ButtonProps = React.ComponentProps<typeof ReactAriaButton>;

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <ReactAriaButton className={clsx(styles.button, className)} {...props} />;
};
