import React from 'react';
import { Button, ButtonGroup } from '@noom/wax-component-library';

function DefaultButton(props) {
  return <Button colorScheme="gray" variant="outline" size="md" paddingX={4} {...props} />;
}

function PrimaryButton(props) {
  return <DefaultButton {...props} colorScheme="primary" variant="solid" />;
}

function SecondaryButton(props) {
  return <DefaultButton {...props} colorScheme="gray" variant="ghost" />;
}

// legacy
export { PrimaryButton, SecondaryButton, ButtonGroup };

const LeButton = ({ variant, ...props }) => {
  const Component =
    {
      primary: PrimaryButton,
      secondary: SecondaryButton,
    }[variant] || DefaultButton;

  return <Component {...props} />;
};

export default LeButton;
