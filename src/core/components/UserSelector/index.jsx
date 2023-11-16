import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import customizableComponent from '~/core/hocs/customization';

import useUserQuery from '~/core/hooks/useUserQuery';

import UiKitInputAutocomplete from '~/core/components/InputAutocomplete';
import UiKitUserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';

const SUGGESTIONS_MIN_LENGTH = 2;

const UserSelector = ({ value = [], onChange = () => {} }) => {
  const userIds = value;

  const [query, setQuery] = useState('');

  const [users, hasMore, loadMore] = useUserQuery(
    query,
    query.length > SUGGESTIONS_MIN_LENGTH ? [query] : [],
  );

  const handleAdd = (newUser) => {
    const { userId } = newUser;

    if (!userIds.includes(userId)) {
      onChange([...userIds, userId]);
      setQuery('');
    }
  };

  const handleRemove = (userId) => {
    onChange(userIds.filter((id) => id !== userId));
  };

  const handlePop = () => {
    onChange(userIds.slice(0, -1));
  };

  const ChipList =
    !!userIds.length &&
    userIds.map((userId) => <UserChip key={userId} userId={userId} onRemove={handleRemove} />);

  const filter = (items) => items;

  return (
    <UiKitInputAutocomplete
      prepend={ChipList}
      value={query}
      items={users}
      filter={filter}
      loadMore={hasMore ? loadMore : null}
      expand={SUGGESTIONS_MIN_LENGTH}
      onClear={handlePop}
      onChange={setQuery}
      onPick={handleAdd}
    >
      {(item) => <UiKitUserHeader userId={item.userId} />}
    </UiKitInputAutocomplete>
  );
};

UserSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(customizableComponent('UserSelector', UserSelector));
