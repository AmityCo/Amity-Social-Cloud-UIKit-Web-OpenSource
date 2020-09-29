import React from 'react';
import { DefaultButton, PrimaryButton, SecondaryButton } from './styles';

// legacy
export { PrimaryButton, SecondaryButton };

export default ({ variant, ...props }) => {
  const Button =
    {
      primary: PrimaryButton,
      secondary: SecondaryButton,
    }[variant] || DefaultButton;

  return <Button {...props} />;
};
