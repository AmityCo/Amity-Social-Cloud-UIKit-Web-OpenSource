import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import SideMenuActionItem, { ALLOWED_ELEMENTS } from '.';

const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 20px;
`;

export default {
  title: 'Components/SideMenu/ActionItem',
  parameters: { layout: 'centered' },
};

export const Basic = ({ element, icon, active, showIcon, children, onClick }) => {
  let iconToShow = icon;
  if (!showIcon) iconToShow = null;
  return (
    <SideMenuActionItem element={element} icon={iconToShow} active={active} onClick={onClick}>
      {children}
    </SideMenuActionItem>
  );
};

Basic.args = {
  element: 'button',
  children: 'children slot',
  active: false,
  showIcon: true,
  icon: <PlusIcon />,
};

Basic.argTypes = {
  element: { control: { type: 'select', options: ALLOWED_ELEMENTS } },
  children: { control: { type: 'text' } },
  active: { control: { type: 'boolean' } },
  showIcon: { control: { type: 'boolean' } },
  onClick: { action: 'onClick' },
};
