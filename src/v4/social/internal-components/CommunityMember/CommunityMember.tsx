import React from 'react';
import styles from './CommunityMember.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/MentionTextInput/MentionTextInput';

interface CommunityMemberProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

export function CommunityMember({
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: CommunityMemberProps) {
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
        <p className={styles.communityMember__displayName}>{option.user.displayName}</p>
      </div>
    </div>
  );
}
