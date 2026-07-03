import type { Ref } from 'react';
import { MentionData as UserMentionData } from '~/v4/social/internal-components/Lexical/utils';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { BrandBadge } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import { TEXT } from '~/v4/chat/constants';
import styles from './UserMentionItem.module.css';
import { useString } from '~/v4/core/localization';

type UserMentionItemProps = {
  pageId?: string;
  isSelected: boolean;
  onClick: (user: Amity.User) => void;
  componentId?: string;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<UserMentionData>;
};

const ALL_USER_ID = 'all';

export function UserMentionItem({
  option,
  onClick,
  isSelected,
  onMouseEnter,
  pageId = '*',
  componentId = '*',
}: UserMentionItemProps) {
  const isAllRow = option.data.userId === ALL_USER_ID;
  const notifyEveryoneLabel = useString('amity_chat_mention_everyone');

  const { user } = useUser({
    userId: option.data.userId,
    shouldCall: !isAllRow,
  });

  if (isAllRow) {
    return (
      <button
        type="button"
        key={option.key}
        ref={option.setRefElement as unknown as Ref<HTMLButtonElement>}
        aria-selected={isSelected}
        data-is-selected={isSelected}
        className={`${styles.userMentionItem__item} ${styles.userMentionItem__allRow}`}
        data-testid={`${pageId}/${componentId}/mention_all_item`}
        onMouseEnter={onMouseEnter}
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => onClick({ userId: ALL_USER_ID } as Amity.User)}
      >
        <div className={styles.userMentionItem__allIconCircle} aria-hidden="true">
          <span className={styles.userMentionItem__allIconGlyph}>@</span>
        </div>
        <div className={styles.userMentionItem__allRightPane}>
          <Typography.CaptionBold className={styles.userMentionItem__displayName}>
            {TEXT.MENTION.PICKER.ALL_LABEL}
          </Typography.CaptionBold>
          <Typography.Caption className={styles.userMentionItem__allDescription}>
            {notifyEveryoneLabel}
          </Typography.Caption>
        </div>
      </button>
    );
  }

  if (!user) return null;

  return (
    <button
      type="button"
      key={option.key}
      ref={option.setRefElement as unknown as Ref<HTMLButtonElement>}
      aria-selected={isSelected}
      data-is-selected={isSelected}
      className={styles.userMentionItem__item}
      data-testid={`${pageId}/${componentId}/mention_item`}
      onMouseEnter={onMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
      onClick={() => onClick(user)}
    >
      <UserAvatar
        pageId={pageId}
        componentId={componentId}
        userId={option.data.userId}
        className={styles.userMentionItem__avatar}
        defaultAvatarIconClassName={styles.userMentionItem__avatar}
      />
      <div className={styles.userMentionItem__rightPane}>
        <Typography.CaptionBold className={styles.userMentionItem__displayName}>
          {user?.displayName}
        </Typography.CaptionBold>
        {user?.isBrand ? (
          <BrandBadge
            pageId={pageId}
            componentId={componentId}
            className={styles.userMentionItem__brandIcon}
          />
        ) : null}
      </div>
    </button>
  );
}
