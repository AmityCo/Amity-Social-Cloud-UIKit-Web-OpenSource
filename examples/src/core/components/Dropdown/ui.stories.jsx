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

export const SimpleDropdown = {
  render: () => {
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
  },

  args: {
    isOpen: false,
    position: POSITION_BOTTOM,
    align: POSITION_LEFT,
  },

  argTypes: {
    isOpen: { control: { type: 'boolean' } },
    position: { control: { type: 'select' }, options: [POSITION_TOP, POSITION_BOTTOM] },
    align: { control: { type: 'select' }, options: [POSITION_LEFT, POSITION_RIGHT] },
    onClick: { action: 'onClick()' },
  },
};

export const DropdownWithCustomTrigger = {
  render: () => {
    const [{ isOpen, position, align }, updateArgs] = useArgs();

    const toggle = () => updateArgs({ isOpen: !isOpen });
    const close = () => updateArgs({ isOpen: false });

    return (
      <UiKitDropdown
        isOpen={isOpen}
        renderTrigger={(props) => (
          <OptionsButton {...props} onClick={toggle}>
            <OptionsIcon />
          </OptionsButton>
        )}
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
  },

  args: {
    isOpen: false,
    position: POSITION_BOTTOM,
    align: POSITION_LEFT,
  },

  argTypes: {
    isOpen: { control: { type: 'boolean' } },
    position: { control: { type: 'select' }, options: [POSITION_TOP, POSITION_BOTTOM] },
    align: { control: { type: 'select' }, options: [POSITION_LEFT, POSITION_RIGHT] },
    onClick: { action: 'onClick()' },
  },
};

export const ScrollableDropdownWithCustomTrigger = {
  render: () => {
    const [{ isOpen, position, fullSized, scrollable }, updateArgs] = useArgs();

    const toggle = () => updateArgs({ isOpen: !isOpen });
    const close = () => updateArgs({ isOpen: false });

    const items = Array.from({ length: 20 }).map((item, index) => (
      <Option key={`item_${index + 1}`}>{`item_${index}`}</Option>
    ));

    return (
      <UiKitDropdown
        isOpen={isOpen}
        renderTrigger={(props) => <input type="text" {...props} onClick={toggle} />}
        position={position}
        // when using custom trigger we should handle close on click outside (if needed)
        handleClose={close}
        fullSized={fullSized}
        scrollable={scrollable}
      >
        {items}
      </UiKitDropdown>
    );
  },

  args: {
    isOpen: false,
    position: POSITION_BOTTOM,
    fullSized: true,
    scrollable: true,
  },

  argTypes: {
    isOpen: { control: { type: 'boolean' } },
    fullSized: { control: { type: 'boolean' } },
    scrollable: { control: { type: 'boolean' } },
    position: { control: { type: 'select' }, options: [POSITION_TOP, POSITION_BOTTOM] },
    onClick: { action: 'onClick()' },
  },
};
