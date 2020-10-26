import React from 'react';
import { DefaultButton, PrimaryButton, SecondaryButton } from './styles';

// legacy
export { PrimaryButton, SecondaryButton };

const Button = ({ variant, ...props }) => {
  const Component =
    {
      primary: PrimaryButton,
      secondary: SecondaryButton,
    }[variant] || DefaultButton;

  return <Component {...props} />;
};

export default Button;
