import React from 'react';
import styles from './PostMentionUser.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { MentionTypeaheadOption } from './PostCommentMentionInput';

interface PostMentionUserProps {
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

export function PostMentionUser({
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: PostMentionUserProps) {
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
