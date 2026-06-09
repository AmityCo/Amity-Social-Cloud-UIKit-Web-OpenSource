import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { Header, ArchivedChannelList } from './components';
import styles from './ArchivedChat.module.css';

export function ArchivedChat() {
  const { pop } = useChatNavigation();

  return (
    <div className={styles.archivedChat}>
      <Header onBack={pop} />
      <ArchivedChannelList />
    </div>
  );
}
