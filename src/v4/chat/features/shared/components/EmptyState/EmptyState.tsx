import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { Search } from '~/v4/core/design/icons/Search';
import { SearchCross } from '~/v4/core/design/icons/SearchCross';
import { ListRadio } from '~/v4/core/design/icons/ListRadio';
import { Inbox } from '~/v4/core/design/icons/Inbox';
import styles from './EmptyState.module.css';

type EmptyStateVariant =
  | 'prompt'
  | 'no-results'
  | 'no-members'
  | 'no-banned-users'
  | 'no-archived-chats';

type EmptyStateProps = {
  variant: EmptyStateVariant;
};

function getIcon(variant: EmptyStateVariant) {
  if (variant === 'prompt') return Search.Light;
  if (variant === 'no-banned-users') return ListRadio;
  if (variant === 'no-archived-chats') return Inbox;
  return SearchCross;
}

export function EmptyState({ variant }: EmptyStateProps) {
  const content: Record<EmptyStateVariant, string> = {
    prompt: useString('amity_chat_search_min_chars'),
    'no-results': useString('amity_chat_search_no_results'),
    'no-members': useString('amity_chat_no_members_found'),
    'no-banned-users': useString('amity_chat_banned_members_empty'),
    'no-archived-chats': useString('amity_chat_archived_empty_title'),
  };

  const Icon = getIcon(variant);

  return (
    <div className={styles.emptyState} data-variant={variant}>
      <Icon className={styles.emptyState__icon} />
      <Typography.TitleBold className={styles.emptyState__text}>
        {content[variant]}
      </Typography.TitleBold>
    </div>
  );
}
