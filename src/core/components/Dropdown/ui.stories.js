import React from 'react';
import { FormattedMessage } from 'react-intl';
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
      <Option onClick={onClick}>
        <FormattedMessage id="dropdown.first" />
      </Option>
      <Option onClick={onClick}>
        <FormattedMessage id="dropdown.second" />
      </Option>
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

  const triggerRenderer = props => {
    return (
      <OptionsButton {...props}>
        <OptionsIcon />
      </OptionsButton>
    );
  };

  return (
    <UiKitDropdown
      isOpen={isOpen}
      renderTrigger={props => triggerRenderer({ ...props, onClick: toggle })}
      position={position}
      align={align}
      // when using custom trigger we should handle close on click outside (if needed)
      handleClose={close}
    >
      <Option>
        <FormattedMessage id="dropdown.first" />
      </Option>
      <Option>
        <FormattedMessage id="dropdown.second" />
      </Option>
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

export const ScrollableDropdownWithCustomTrigger = () => {
  const [{ isOpen, position, fullSized, scrollable }, updateArgs] = useArgs();

  const toggle = () => updateArgs({ isOpen: !isOpen });
  const close = () => updateArgs({ isOpen: false });

  const triggerRenderer = props => {
    return <input type="text" {...props} />;
  };

  const items = Array.from({ length: 20 }).map((item, index) => (
    <Option key={`item_${index + 1}`}>{`item_${index}`}</Option>
  ));

  return (
    <UiKitDropdown
      isOpen={isOpen}
      renderTrigger={props => triggerRenderer({ ...props, onClick: toggle })}
      position={position}
      // when using custom trigger we should handle close on click outside (if needed)
      handleClose={close}
      fullSized={fullSized}
      scrollable={scrollable}
    >
      {items}
    </UiKitDropdown>
  );
};

ScrollableDropdownWithCustomTrigger.args = {
  isOpen: false,
  position: POSITION_BOTTOM,
  fullSized: true,
  scrollable: true,
};

ScrollableDropdownWithCustomTrigger.argTypes = {
  isOpen: { control: { type: 'boolean' } },
  fullSized: { control: { type: 'boolean' } },
  scrollable: { control: { type: 'boolean' } },
  position: { control: { type: 'select', options: [POSITION_TOP, POSITION_BOTTOM] } },
  onClick: { action: 'onClick()' },
};
