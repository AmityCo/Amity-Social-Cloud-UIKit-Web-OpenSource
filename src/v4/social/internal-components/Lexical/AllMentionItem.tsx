import React from 'react';
import { MentionTypeaheadOption } from './plugins/MentionPlugin';
import { MentionData } from './utils';

import styles from './MentionItem.module.css';

interface MentionItemProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<MentionData>;
}

export function AllMentionItem({ option, isSelected, onClick, onMouseEnter }: MentionItemProps) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      data-is-selected={isSelected}
      className={styles.allMentionItem__item}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className={styles.allMentionItem__atSign}>@</div>
      <p className={styles.allMentionItem__displayName}>{option.data.displayName}</p>
    </li>
  );
}
