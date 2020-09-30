import React, { useState, useEffect, useRef } from 'react';

import { MenuItem } from '~/core/components/Menu';
import { customizableComponent } from '~/core/hocs/customization';
import { testUsers } from '~/mock';

import {
  Avatar,
  Selector,
  SelectorList,
  SelectorPopover,
  UserSelectorInput,
  Chip,
  CloseIcon,
} from './styles';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserChip = ({ user, onRemove }) => (
  <Chip>
    <Avatar size="tiny" avatar={user.avatar} /> {`${user.displayName || DEFAULT_DISPLAY_NAME} `}
    <CloseIcon onClick={onRemove} />
  </Chip>
);

const User = ({ user }) => (
  <>
    <Avatar size="tiny" avatar={user.avatar} /> {user.displayName || DEFAULT_DISPLAY_NAME}
  </>
);

const useRunOnUpdate = (fn, deps) => {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      // prevent firing on first render
      isFirstRun.current = false;
      return;
    }
    return fn();
  }, deps);
};

const UserSelector = ({ value: userIds, onChange }) => {
  const inputRef = useRef(null);
  const focus = () => inputRef.current.focus();

  const [query, setQuery] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
    focus();
  };
  const close = () => setIsOpen(false);

  // open selector list each time query changes
  useRunOnUpdate(() => {
    open();
  }, [query]);

  const selectedUsers = userIds.map(id => testUsers.find(({ userId }) => id === userId));

  const searchResult = query.length
    ? testUsers.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    : testUsers;

  // exclude already selected
  const selectorUsersList = searchResult.filter(({ userId }) => !userIds.includes(userId));

  const add = userId => {
    onChange([...userIds, userId]);
  };

  const remove = userId => {
    onChange(userIds.filter(id => id !== userId));
  };

  const list = (
    <SelectorList onClick={focus}>
      {/* TODO empty state */}
      {selectorUsersList.map(user => (
        <MenuItem
          key={user.userId}
          onClick={e => {
            e.stopPropagation();
            add(user.userId);
          }}
        >
          <User user={user} />
        </MenuItem>
      ))}
    </SelectorList>
  );

  return (
    <SelectorPopover
      isOpen={isOpen && selectorUsersList.length}
      onClickOutside={close}
      content={list}
    >
      <Selector onClick={open}>
        {selectedUsers.map(user => (
          <UserChip key={user.userId} user={user} onRemove={() => remove(user.userId)} />
        ))}
        <UserSelectorInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Select user..."
        />
      </Selector>
    </SelectorPopover>
  );
};

export default customizableComponent('UserSelector', UserSelector);
