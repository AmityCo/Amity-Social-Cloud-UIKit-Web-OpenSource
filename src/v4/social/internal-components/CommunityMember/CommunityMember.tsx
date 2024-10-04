import React from 'react';
import styles from './CommunityMember.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { MentionTypeaheadOption } from '~/v4/social/internal-components/MentionTextInput/MentionTextInput';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';

interface CommunityMemberProps {
  pageId?: string;
  componentId?: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

export function CommunityMember({
  pageId = '*',
  componentId = '*',
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
            pageId={pageId}
            componentId={componentId}
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
