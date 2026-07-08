import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { WaitingForNetwork } from '~/v4/chat/elements/WaitingForNetwork/WaitingForNetwork';
import { ChatHomeMenu } from '~/v4/chat/features/home/elements/ChatHomeMenu/ChatHomeMenu';
import { CreateChatMenu } from '~/v4/chat/features/home/elements/CreateChatMenu/CreateChatMenu';
import { SearchButton } from '~/v4/chat/features/home/elements/SearchButton/SearchButton';
import styles from './Header.module.css';

export function Header() {
  const title = useString('amity_chat_home_title');

  return (
    <header className={styles.header}>
      <Typography.Headline className={styles.header__title}>{title}</Typography.Headline>
      <WaitingForNetwork />
      <div className={styles.header__actions}>
        <SearchButton />
        <CreateChatMenu />
        <ChatHomeMenu />
      </div>
    </header>
  );
}
