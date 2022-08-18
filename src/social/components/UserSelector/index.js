import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import useElement from '~/core/hooks/useElement';
import useUserQuery from '~/core/hooks/useUserQuery';
import Select from '~/core/components/Select';
import UserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';
import withSDK from '~/core/hocs/withSDK';

import { Selector, UserSelectorInput } from './styles';

const UserSelector = ({
  value: userIds = [],
  onChange = () => {},
  parentContainer = null,
  currentUserId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queriedUsers = []] = useUserQuery(query);
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
    name: (queriedUsers.find((user) => user.userId === userId) ?? {}).displayName,
    value: userId,
  }));

  const close = () => {
    setIsOpen(false);
    // clear text input on close
    setQuery('');
  };

  const [inputRef, inputElement] = useElement();

  const handleChange = (value) => {
    setQuery(value);
    // open dropdown only when there some data in the text input
    setIsOpen(!!value);
    if (value) {
      inputElement.focus();
    }
  };

  const itemRenderer = ({ value: userId }) => <UserHeader userId={userId} />;

  const triggerRenderer = ({ selected, remove, ...props }) => {
    return (
      <Selector {...props}>
        {selected.map(({ value: userId }) => (
          <UserChip key={userId} userId={userId} onRemove={() => remove(userId, onChange)} />
        ))}
        <UserSelectorInput
          ref={inputRef}
          type="text"
          value={query}
          placeholder={formatMessage({ id: 'UserSelector.placeholder' })}
          onChange={(e) => handleChange(e.target.value)}
        />
      </Selector>
    );
  };

  return (
    <Select
      value={selectedUsers}
      // prevent show dropdown for empty query
      options={query ? options : []}
      renderTrigger={triggerRenderer}
      renderItem={itemRenderer}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      multiple
      onSelect={({ value }) => {
        onChange([...userIds, value]);
        inputElement.focus();
        // clear input on select item
        setQuery('');
      }}
    />
  );
};

UserSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  parentContainer: PropTypes.element,
  currentUserId: PropTypes.string,
  onChange: PropTypes.func,
};

export default memo(withSDK(customizableComponent('UserSelector', UserSelector)));
