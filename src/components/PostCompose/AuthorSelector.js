import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';
import Popover from 'components/Popover';
import Menu, { MenuItem } from 'components/Menu';

import { AuthorSelectorContainer, CommunitySeparator, SelectIcon, Avatar } from './styles';

const AuthorSelector = ({ author, user, communities, onChange }) => {
  if (!communities || !communities.length) return <Avatar avatar={author.avatar} />;

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const menu = (
    <Menu>
      <MenuItem
        onClick={() => {
          onChange(user);
          close();
        }}
      >
        <Avatar size="tiny" avatar={user.avatar} /> My Timeline
      </MenuItem>
      <CommunitySeparator>Community</CommunitySeparator>
      {communities.map(community => (
        <MenuItem
          key={community.communityId}
          active={author.communityId === community.communityId}
          onClick={() => {
            onChange(community);
            close();
          }}
        >
          <Avatar avatar={community.avatar} size="tiny" /> {community.name}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <div>
      <Popover
        isOpen={isOpen}
        onClickOutside={close}
        position="bottom"
        align="start"
        content={menu}
      >
        <AuthorSelectorContainer onClick={open}>
          <Avatar avatar={author.avatar} /> <SelectIcon />
        </AuthorSelectorContainer>
      </Popover>
    </div>
  );
};

export default customizableComponent('AuthorSelector')(AuthorSelector);
