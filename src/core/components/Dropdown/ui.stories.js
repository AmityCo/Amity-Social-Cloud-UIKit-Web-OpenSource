import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitDropdown from '.';
import { Option, OptionsButton, OptionsIcon } from '~/core/components/OptionMenu/styles';
import {
  POSITION_BOTTOM,
  POSITION_LEFT,
  POSITION_TOP,
  POSITION_RIGHT,
} from '~/helpers/getCssPosition';

export default {
  title: 'Ui Only/Dropdown',
};

export const SimpleDropdown = () => {
  const [{ isOpen, onClick, position, align }] = useArgs();
  return (
    <UiKitDropdown isOpen={isOpen} position={position} align={align}>
      <Option onClick={onClick}>First</Option>
      <Option onClick={onClick}>Second</Option>
    </UiKitDropdown>
  );
};

SimpleDropdown.args = {
  isOpen: false,
  position: POSITION_BOTTOM,
  align: POSITION_LEFT,
};

SimpleDropdown.argTypes = {
  isOpen: { control: { type: 'boolean' } },
  position: { control: { type: 'select', options: [POSITION_TOP, POSITION_BOTTOM] } },
  align: { control: { type: 'select', options: [POSITION_LEFT, POSITION_RIGHT] } },
  onClick: { action: 'onClick()' },
};

export const DropdownWithCustomTrigger = () => {
  const [{ isOpen, position, align }, updateArgs] = useArgs();

  const toggle = () => updateArgs({ isOpen: !isOpen });
  const close = () => updateArgs({ isOpen: false });

  const Trigger = () => {
    return (
      <OptionsButton onClick={toggle}>
        <OptionsIcon />
      </OptionsButton>
    );
  };

  return (
    <UiKitDropdown
      isOpen={isOpen}
      trigger={<Trigger />}
      position={position}
      align={align}
      // when using custom trigger we should handle close on click outside (if needed)
      handleClose={close}
    >
      <Option>First</Option>
      <Option>Second</Option>
    </UiKitDropdown>
  );
};

DropdownWithCustomTrigger.args = {
  isOpen: false,
  position: POSITION_BOTTOM,
  align: POSITION_LEFT,
};

DropdownWithCustomTrigger.argTypes = {
  isOpen: { control: { type: 'boolean' } },
  position: { control: { type: 'select', options: [POSITION_TOP, POSITION_BOTTOM] } },
  align: { control: { type: 'select', options: [POSITION_LEFT, POSITION_RIGHT] } },
  onClick: { action: 'onClick()' },
};
