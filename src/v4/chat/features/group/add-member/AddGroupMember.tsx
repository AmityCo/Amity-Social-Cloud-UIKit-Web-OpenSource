import { Controller } from 'react-hook-form';
import { UserList } from '~/v4/chat/features/group/select-member/components/UserList';
import { Header } from '~/v4/chat/features/group/add-member/components/Header';
import { AddMemberButton } from '~/v4/chat/features/group/add-member/components/AddMemberButton';
import { useAddGroupMember } from '~/v4/chat/features/group/add-member/hooks/useAddGroupMember';
import type { AddGroupMemberPageProps } from '~/v4/chat/pages/AddGroupMemberPage';
import styles from './AddGroupMember.module.css';

export function AddGroupMember(props: AddGroupMemberPageProps) {
  const {
    form,
    searchText,
    debouncedText,
    selectedUsers,
    setSearchText,
    setSelectedUsers,
    removeUser,
    handleClose,
    handleAddMember,
    isFormValid,
  } = useAddGroupMember(props);

  return (
    <form className={styles.addGroupMember} onSubmit={handleAddMember}>
      <Header
        searchValue={searchText}
        selectedUsers={selectedUsers}
        onClose={handleClose}
        onSearchChange={setSearchText}
        onRemoveUser={removeUser}
      />
      <div className={styles.addGroupMember__list}>
        <Controller
          control={form.control}
          name="selectedUsers"
          render={({ field: { value } }) => (
            <UserList
              searchText={debouncedText}
              selectedUsers={value}
              onChange={setSelectedUsers}
            />
          )}
        />
      </div>
      <AddMemberButton isDisabled={!isFormValid} />
    </form>
  );
}
