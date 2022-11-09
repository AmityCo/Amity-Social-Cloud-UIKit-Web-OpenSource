import React from 'react';
import { Button } from '@noom/wax-component-library';

function PrimaryButton(props) {
  return <Button colorScheme="primary" size="md" {...props} />;
}

function SecondaryButton(props) {
  return <Button colorScheme="gray" variant="ghost" size="md" {...props} />;
}

function DefaultButton(props) {
  return <Button colorScheme="gray" variant="outline" size="md" {...props} />;
}

// legacy
export { PrimaryButton, SecondaryButton };

const LeButton = ({ variant, ...props }) => {
  const Component =
    {
      primary: PrimaryButton,
      secondary: SecondaryButton,
    }[variant] || DefaultButton;

  return <Component {...props} />;
};

export default LeButton;
