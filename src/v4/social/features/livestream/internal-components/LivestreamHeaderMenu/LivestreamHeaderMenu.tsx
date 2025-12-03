import React from 'react';
import { Typography } from '~/v4/core/components';
import { Label } from 'react-aria-components';
import { ReadOnlyToggle } from '~/v4/social/features/livestream/internal-components/ReadOnlyToggle';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { SharableModel } from '~/v4/utils/sharableLink';
import styles from './LivestreamHeaderMenu.module.css';

export interface LivestreamHeaderMenuProps {
  pageId: string;
  postId?: string;
  targetType: 'community' | 'user' | 'event';
  readOnly: boolean;
  isCommunityPublic?: boolean;
  onChangeReadOnly: (readOnly: boolean) => void;
  onLinkCopied?: () => void;
}

export const LivestreamHeaderMenu: React.FC<LivestreamHeaderMenuProps> = ({
  pageId,
  postId,
  targetType,
  readOnly,
  isCommunityPublic,
  onChangeReadOnly,
  onLinkCopied,
}) => {
  return (
    <div className={styles.livestreamHeaderMenu}>
      {targetType !== 'user' && (
        <ReadOnlyToggle
          isSelected={readOnly}
          onChange={onChangeReadOnly}
          className={styles.livestreamHeaderMenu__readOnlyToggle}
        />
      )}
      {postId && (isCommunityPublic || targetType === 'user') && (
        <CopyLinkButton
          pageId={pageId}
          model={SharableModel.POST}
          referenceId={postId}
          onDone={onLinkCopied}
        />
      )}
    </div>
  );
};
