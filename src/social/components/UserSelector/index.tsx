import React, { memo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useUserQueryByDisplayName } from '~/core/hooks/useUserQuery';
import Select from '~/core/components/Select';
import UserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';

import { Selector, UserSelectorInput } from './styles';
import useSDK from '~/core/hooks/useSDK';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UserSelectorProps {
  value?: string[];
  parentContainer?: HTMLElement | null;
  onChange?: (value: string[]) => void;
}

const UserSelector = ({ value, onChange, parentContainer = null }: UserSelectorProps) => {
  const userIds = value ?? [];

  const { currentUserId } = useSDK();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { users: queriedUsers = [] } = useUserQueryByDisplayName(query);
  const { formatMessage } = useIntl();

  const options = queriedUsers
    .filter(
      ({ displayName, userId }) =>
        displayName?.toLowerCase().includes(query.toLowerCase()) && userId !== currentUserId,
    )
    .map(({ displayName, userId }) => ({
      name: displayName,
      value: userId,
    }));

  const selectedUsers = userIds.map((userId) => ({
    name: queriedUsers.find((user) => user.userId === userId)?.displayName || '',
    value: userId,
  }));

  const close = () => {
    setIsOpen(false);
    // clear text input on close
    setQuery('');
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    // open dropdown only when there some data in the text input
    setIsOpen(!!value);
    if (value) {
      inputRef.current?.focus();
    }
  };

  return (
    <Select
      data-qa-anchor="user"
      value={selectedUsers}
      // prevent show dropdown for empty query
      options={query ? options : []}
      renderTrigger={({ selected, remove, ...props }) => (
        <Selector {...props}>
          {selected.map((selectedItem) => (
            <UserChip
              key={selectedItem.value}
              userId={selectedItem.value}
              onRemove={() => remove(selectedItem, onChange)}
            />
          ))}
          <UserSelectorInput
            ref={inputRef}
            data-qa-anchor="user-selector-input"
            type="text"
            value={query}
            placeholder={formatMessage({ id: 'UserSelector.placeholder' })}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Selector>
      )}
      renderItem={({ value: userId }) => {
        return <UserHeader userId={userId} />;
      }}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      multiple
      onSelect={({ value }) => {
        onChange?.([...new Set([...userIds, value])]);
        inputRef.current?.focus();
        // clear input on select item
        setQuery('');
      }}
    />
  );
};

export default memo((props: UserSelectorProps) => {
  const CustomComponentFn = useCustomComponent<UserSelectorProps>('UserSelector');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UserSelector {...props} />;
});
