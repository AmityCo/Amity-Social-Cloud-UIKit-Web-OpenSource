import React from 'react';
import { MentionData } from './utils';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { MentionTypeaheadOption } from './plugins/MentionPlugin';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { Button } from '~/v4/core/components/AriaButton';
import { BrandBadge } from '~/v4/social/elements';
import styles from './MentionItem.module.css';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { useUser } from '~/v4/core/hooks/objects/useUser';

type MentionItemProps = {
  pageId?: string;
  isSelected: boolean;
  onClick: (user: Amity.User) => void;
  componentId?: string;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<MentionData>;
};

export function MentionItem({
  option,
  onClick,
  isSelected,
  onMouseEnter,
  pageId = '*',
  componentId = '*',
}: MentionItemProps) {
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
      <div>
        <UserAvatar
          pageId={pageId}
          componentId={componentId}
          userId={option.data.userId}
          className={styles.userMentionItem__avatar}
        />
      </div>
      <div className={styles.userMentionItem__rightPane}>
        <p className={styles.userMentionItem__displayName}>{user?.displayName}</p>
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
