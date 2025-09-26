import React, { memo, useState } from 'react';

import { useUserQueryByDisplayName } from '~/core/hooks/useUserQuery';

import UiKitInputAutocomplete from '~/core/components/InputAutocomplete';
import UiKitUserHeader from '~/social/components/UserHeader';
import UserChip from '~/core/components/UserChip';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const SUGGESTIONS_MIN_LENGTH = 2;

interface UserSelectorProps {
  value?: string[];
  onChange?: (newValues: string[]) => void;
}

const UserSelector = ({ value = [], onChange }: UserSelectorProps) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(value);

  const [query, setQuery] = useState('');

  const { users, hasMore, loadMore } = useUserQueryByDisplayName(query, SUGGESTIONS_MIN_LENGTH);

  const items = users.map((user) => ({
    label: user.displayName || user.userId,
    value: user.userId,
  }));

  const handleRemove = (userId: string) => {
    const newUserIds = selectedUserIds.filter((id) => id !== userId);
    onChange?.(newUserIds);
    setSelectedUserIds?.(newUserIds);
  };

  return (
    <UiKitInputAutocomplete
      prepend={
        selectedUserIds.length > 0
          ? selectedUserIds.map((userId) => (
              <UserChip key={userId} userId={userId} onRemove={handleRemove} />
            ))
          : null
      }
      value={selectedUserIds}
      searchValue={query}
      onSearchValueChange={(newSearchValue) => setQuery(newSearchValue)}
      items={items}
      loadMore={hasMore ? loadMore : undefined}
      onClear={() => setSelectedUserIds([])}
      onChange={(newValues) =>
        Array.isArray(newValues) ? setSelectedUserIds(newValues) : setSelectedUserIds([newValues])
      }
      renderItem={(item) => <UiKitUserHeader userId={item.value} />}
    />
  );
};

export default memo((props: UserSelectorProps) => {
  const CustomComponentFn = useCustomComponent<UserSelectorProps>('UserSelector');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UserSelector {...props} />;
});
