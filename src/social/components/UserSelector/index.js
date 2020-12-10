import React, { useState } from 'react';
import PropTypes from 'prop-types';

import customizableComponent from '~/core/hocs/customization';
import useElement from '~/core/hooks/useElement';
import useUserQuery from '~/core/hooks/useUserQuery';
import Select from '~/core/components/Select';
import UserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';

import { Selector, UserSelectorInput } from './styles';

const UserSelector = ({ value: userIds = [], onChange = () => {}, parentContainer = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queriedUsers = []] = useUserQuery(query);

  const options = queriedUsers
    .filter(({ displayName }) => displayName?.toLowerCase().includes(query.toLowerCase()))
    .map(({ displayName, userId }) => ({
      name: displayName,
      value: userId,
    }));

  const close = () => {
    setIsOpen(false);
    // clear text input on close
    setQuery('');
  };

  const [inputRef, inputElement] = useElement();

  const handleChange = value => {
    setQuery(value);
    // open dropdown only when there some data in the text input
    setIsOpen(!!value);
    if (value) {
      inputElement.focus();
    }
  };

  const itemRenderer = ({ value: userId }) => <UserHeader userId={userId} />;

  const triggerRenderer = ({ selected, removeByIndex, ...props }) => {
    return (
      <Selector {...props}>
        {selected.map(({ value: userId }) => (
          <UserChip
            key={userId}
            userId={userId}
            onRemove={() => {
              const index = selected.findIndex(item => item.value === userId);
              if (index >= 0) {
                removeByIndex(index);
              }
            }}
          />
        ))}
        <UserSelectorInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          placeholder="Select user..."
        />
      </Selector>
    );
  };

  return (
    <Select
      value={userIds}
      options={options}
      onSelect={({ value }) => {
        onChange([...userIds, value]);
        inputElement.focus();
      }}
      renderTrigger={triggerRenderer}
      renderItem={itemRenderer}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      multiple
    />
  );
};

UserSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  parentContainer: PropTypes.element,
};

export default customizableComponent('UserSelector', UserSelector);
