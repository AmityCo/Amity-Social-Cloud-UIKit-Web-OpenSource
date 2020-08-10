import React, { useState, useEffect } from 'react';

import Popover from '../commonComponents/Popover';
import Menu, { MenuItem } from '../commonComponents/Menu';

import { OptionsIcon, OptionsButton } from './styles';

const Options = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const attachCanceling = fn => () => {
    close();
    fn && fn();
  };

  const menu = (
    <Menu>
      <MenuItem onClick={attachCanceling(onEdit)}>Edit post</MenuItem>
      <MenuItem onClick={attachCanceling(onDelete)}>Delete post</MenuItem>
    </Menu>
  );

  return (
    <Popover isOpen={isOpen} onClickOutside={close} position="bottom" align="end" content={menu}>
      <OptionsButton onClick={open}>
        <OptionsIcon />
      </OptionsButton>
    </Popover>
  );
};

export default Options;
