import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';

import UiKitSideMenuActionItem, { ALLOWED_ELEMENTS } from '.';

const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 20px;
`;

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
  icon: <PlusIcon />,
};

ActionItem.argTypes = {
  element: { control: { type: 'select', options: ALLOWED_ELEMENTS } },
  children: { control: { type: 'text' } },
  active: { control: { type: 'boolean' } },
  showIcon: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
};
