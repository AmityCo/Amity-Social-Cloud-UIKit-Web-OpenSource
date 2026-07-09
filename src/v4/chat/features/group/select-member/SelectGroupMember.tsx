import { Controller } from 'react-hook-form';
import { Header } from '~/v4/chat/features/group/select-member/components/Header/Header';
import { UserList } from '~/v4/chat/features/group/select-member/components/UserList/UserList';
import { useSelectGroupMember } from '~/v4/chat/features/group/select-member/hooks/useSelectGroupMember';
import type { SelectGroupMemberPageProps } from '~/v4/chat/pages/SelectGroupMemberPage';
import styles from './SelectGroupMember.module.css';

export function SelectGroupMember({ selectedGroupMember }: SelectGroupMemberPageProps) {
  const {
    form,
    searchText,
    setSearchText,
    debouncedText,
    selectedUsers,
    setSelectedUsers,
    removeUser,
    isFormValid,
    handleClose,
    handleNext,
  } = useSelectGroupMember({ selectedGroupMember });

  return (
    <form className={styles.selectGroupMember} onSubmit={handleNext}>
      <Header
        onClose={handleClose}
        searchValue={searchText}
        onRemoveUser={removeUser}
        selectedUsers={selectedUsers}
        isFormValid={isFormValid}
        onSearchChange={setSearchText}
      />
      <Controller
        control={form.control}
        name="selectedUsers"
        render={({ field: { value } }) => (
          <UserList searchText={debouncedText} selectedUsers={value} onChange={setSelectedUsers} />
        )}
      />
    </form>
  );
}
