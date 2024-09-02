import React from 'react';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { MentionTypeaheadOption } from './plugins/MentionPlugin';
import { MentionData } from './utils';

import styles from './MentionItem.module.css';

interface MentionItemProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<MentionData>;
}

export function MentionItem({ option, isSelected, onClick, onMouseEnter }: MentionItemProps) {
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
      <p className={styles.userMentionItem__displayName}>{option.data.displayName}</p>
    </li>
  );
}
