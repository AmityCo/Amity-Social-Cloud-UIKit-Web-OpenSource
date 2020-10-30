import React, { useState, useEffect, useRef } from 'react';

import customizableComponent from '~/core/hocs/customization';

import useUserQuery from '~/core/hooks/useUserQuery';

import UserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';

import { Selector, SelectorList, SelectorPopover, UserSelectorInput, Clickable } from './styles';

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

  const close = () => {
    setIsOpen(false);
  };

  // open selector list each time query changes
  useRunOnUpdate(() => {
    open();
  }, [query]);

  const [queriedUsers = []] = useUserQuery(query);

  const selectedUsers = userIds.map(id => queriedUsers.find(({ userId }) => id === userId));

  const searchResult = query.length
    ? queriedUsers.filter(({ displayName }) =>
        displayName?.toLowerCase().includes(query.toLowerCase()),
      )
    : queriedUsers;

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
        <Clickable
          key={user.userId}
          onClick={e => {
            e.stopPropagation();
            add(user.userId);
          }}
        >
          <UserHeader userId={user.userId} />
        </Clickable>
      ))}
    </SelectorList>
  );

  return (
    <SelectorPopover
      isOpen={isOpen && selectorUsersList.length}
      onClickOutside={close}
      content={list}
      fixed
    >
      <Selector onClick={open}>
        {selectedUsers.map(user => (
          <UserChip key={user.userId} userId={user.userId} onRemove={() => remove(user.userId)} />
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
