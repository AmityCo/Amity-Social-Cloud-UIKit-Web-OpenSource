import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { SearchResult } from '~/v4/icons/SearchResult';
import { NoResultIcon } from '~/v4/icons/NoResult';
import { List } from '~/v4/icons/List';
import { Inbox } from '~/v4/icons/Inbox';
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
  if (variant === 'prompt') return SearchResult;
  if (variant === 'no-banned-users') return List;
  if (variant === 'no-archived-chats') return Inbox;
  return NoResultIcon;
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
