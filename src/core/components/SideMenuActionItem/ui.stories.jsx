import React from 'react';

import { Plus } from '~/icons';
import UiKitSideMenuActionItem, { ALLOWED_ELEMENTS } from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Side Menu',
};

export const ActionItem = {
  render: () => {
    const [{ element, icon, active, showIcon, children, onClick }] = useArgs();
    let iconToShow = icon;
    if (!showIcon) iconToShow = null;
    return (
      <UiKitSideMenuActionItem
        element={element}
        icon={iconToShow}
        active={active}
        onClick={onClick}
      >
        {children}
      </UiKitSideMenuActionItem>
    );
  },

  args: {
    element: 'button',
    children: 'children slot',
    active: false,
    showIcon: true,
    icon: <Plus height="20px" />,
  },

  argTypes: {
    element: { control: { type: 'select' }, options: ALLOWED_ELEMENTS },
    children: { control: { type: 'text' } },
    active: { control: { type: 'boolean' } },
    showIcon: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },
};
