import React, { MouseEventHandler } from 'react';
import { DefaultButton, PrimaryButton, SecondaryButton } from './styles';

// legacy
export { PrimaryButton, SecondaryButton };

export interface ButtonProps {
  variant?: string;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  'data-qa-anchor'?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ variant, fullWidth = false, ...props }: ButtonProps) => {
  switch (variant) {
    case 'primary':
      return <PrimaryButton {...props} fullWidth={fullWidth} />;
    case 'secondary':
      return <SecondaryButton {...props} fullWidth={fullWidth} />;
    default:
      return <DefaultButton {...props} fullWidth={fullWidth} />;
  }
};

export default Button;
