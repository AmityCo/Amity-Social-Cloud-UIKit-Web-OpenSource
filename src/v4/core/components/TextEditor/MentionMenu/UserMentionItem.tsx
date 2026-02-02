import React from 'react';
import { MentionData as UserMentionData } from '~/v4/social/internal-components/Lexical/utils';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { Button } from '~/v4/core/components/AriaButton';
import { BrandBadge } from '~/v4/social/elements';
import styles from './UserMentionItem.module.css';
import { Typography } from '~/v4/core/components';

type UserMentionItemProps = {
  pageId?: string;
  isSelected: boolean;
  onClick: (user: Amity.User) => void;
  componentId?: string;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<UserMentionData>;
};

export function UserMentionItem({
  option,
  onClick,
  isSelected,
  onMouseEnter,
  pageId = '*',
  componentId = '*',
}: UserMentionItemProps) {
  const { user } = useUser({ userId: option.data.userId });

  if (!user) return null;

  return (
    <Button
      key={option.key}
      onPress={() => onClick(user)}
      ref={option.setRefElement}
      aria-selected={isSelected}
      onHoverStart={onMouseEnter}
      data-is-selected={isSelected}
      className={styles.userMentionItem__item}
      data-testid={`${pageId}/${componentId}/mention_item`}
      variant="text"
    >
      <UserAvatar
        pageId={pageId}
        componentId={componentId}
        userId={option.data.userId}
        className={styles.userMentionItem__avatar}
      />
      <div className={styles.userMentionItem__rightPane}>
        <Typography.BodyBold className={styles.userMentionItem__displayName}>
          {user?.displayName}
        </Typography.BodyBold>
        {user?.isBrand ? (
          <BrandBadge
            pageId={pageId}
            componentId={componentId}
            className={styles.userMentionItem__brandIcon}
          />
        ) : null}
      </div>
    </Button>
  );
}
