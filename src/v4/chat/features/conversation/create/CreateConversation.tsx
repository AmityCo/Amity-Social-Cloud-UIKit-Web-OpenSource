import { Header } from '~/v4/chat/features/conversation/create/components/Header/Header';
import { UserList } from '~/v4/chat/features/conversation/create/components/UserList/UserList';
import { useCreateConversation } from '~/v4/chat/features/conversation/create/hooks/useCreateConversation';
import styles from './CreateConversation.module.css';

export function CreateConversation() {
  const { searchText, setSearchText, debouncedText, handleSelectUser, handleClose } =
    useCreateConversation();

  return (
    <div className={styles.createConversation}>
      <Header onClose={handleClose} searchValue={searchText} onSearchChange={setSearchText} />
      <UserList searchText={debouncedText} onSelectUser={handleSelectUser} />
    </div>
  );
}
