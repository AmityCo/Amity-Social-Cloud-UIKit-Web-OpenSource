import React from 'react';
import styles from './MentionUser.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { MentionTypeaheadOption } from './CommentMentionInput';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';

interface MentionUserProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

export function MentionUser({ isSelected, onClick, onMouseEnter, option }: MentionUserProps) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }

  return (
    <div
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div key={option.key} className={styles.communityMember__item}>
        <div>
          <UserAvatar
            className={styles.communityMember__avatar}
            userId={option.user.avatarFileId}
          />
        </div>
        <div className={styles.communityMember__rightPane}>
          <p className={styles.communityMember__displayName}>{option.user.displayName}</p>
          {option.user.isBrand ? (
            <BrandBadge className={styles.communityMember__brandIcon} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
