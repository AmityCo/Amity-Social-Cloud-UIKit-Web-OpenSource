import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import Avatar from '~/core/components/Avatar';
import { LayoutHeader, Username, DropdownIcon, DropDownContainer } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LayoutHeader>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={() => setIsOpen(!isOpen)}
      >
        <Avatar />
      </div>
      <Username>
        <FormattedMessage id="layout.username" />
      </Username>
      <Popover
        positions={['bottom']}
        isOpen={isOpen}
        align="end"
        content={
          <Menu>
            <MenuItem>
              <FormattedMessage id="layout.logout" />
            </MenuItem>
          </Menu>
        }
      >
        <DropDownContainer onClick={() => setIsOpen(!isOpen)}>
          <DropdownIcon />
        </DropDownContainer>
      </Popover>
    </LayoutHeader>
  );
};

export default () => {
  const CustomComponentFn = useCustomComponent('Layout');

  if (CustomComponentFn) return CustomComponentFn({});

  return <Layout />;
};
