import React from 'react';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { MentionTypeaheadOption } from './plugins/MentionPlugin';
import { MentionData } from './utils';

import styles from './MentionItem.module.css';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { useUser } from '~/v4/core/hooks/objects/useUser';

interface MentionItemProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<MentionData>;
}

export function MentionItem({ option, isSelected, onClick, onMouseEnter }: MentionItemProps) {
  const { user } = useUser({
    userId: option.data.userId,
  });

  return (
    <li
      key={option.key}
      tabIndex={-1}
      data-is-selected={isSelected}
      className={styles.userMentionItem__item}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div>
        <UserAvatar className={styles.userMentionItem__avatar} userId={option.data.userId} />
      </div>
      <div className={styles.userMentionItem__rightPane}>
        <p className={styles.userMentionItem__displayName}>{user?.displayName}</p>
        {user?.isBrand ? <BrandBadge className={styles.userMentionItem__brandIcon} /> : null}
      </div>
    </li>
  );
}
