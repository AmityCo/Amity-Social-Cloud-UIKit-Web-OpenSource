import React from 'react';

import { Plus } from '~/icons';
import UiKitSideMenuActionItem, { ALLOWED_ELEMENTS } from '.';

export default {
  title: 'Ui Only/Side Menu',
};

export const ActionItem = ({ element, icon, active, showIcon, children, onClick }) => {
  let iconToShow = icon;
  if (!showIcon) iconToShow = null;
  return (
    <UiKitSideMenuActionItem element={element} icon={iconToShow} active={active} onClick={onClick}>
      {children}
    </UiKitSideMenuActionItem>
  );
};

ActionItem.args = {
  element: 'button',
  children: 'children slot',
  active: false,
  showIcon: true,
  icon: <Plus height={20} />,
};

ActionItem.argTypes = {
  element: { control: { type: 'select' }, options: ALLOWED_ELEMENTS },
  children: { control: { type: 'text' } },
  active: { control: { type: 'boolean' } },
  showIcon: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
};
