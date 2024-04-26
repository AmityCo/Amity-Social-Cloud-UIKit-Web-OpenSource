import React from 'react';
import useImage from '~/core/hooks/useImage';
import useCommunity from '~/social/hooks/useCommunity';
import StoryRing from './StoryRing';
import { PrivateIcon } from '~/social/components/community/Name/styles';

import styles from './StoryTabItem.module.css';
import { Typography } from '~/v4/core/components';
import Verified from '~/v4/icons/Verified';

interface StoryTabProps {
  targetId: string;
  hasUnseen: boolean;
  onClick: () => void;
  size: number;
}

export const StoryTabItem: React.FC<StoryTabProps> = ({ targetId, hasUnseen, onClick }) => {
  const community = useCommunity(targetId);
  const communityAvatar = useImage({ fileId: community?.avatarFileId, imageSize: 'small' });

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.avatarContainer}>
        <StoryRing pageId="*" componentId="story_tab_component" hasUnseen={hasUnseen} />
        {community?.isOfficial && <Verified className={styles.verifiedIcon} />}
        <div className={styles.avatarBackground}>
          {communityAvatar && (
            <img className={styles.avatar} src={communityAvatar} alt={community?.displayName} />
          )}
        </div>
      </div>

      <Typography.Caption className={styles.displayName}>
        {!community?.isPublic && <PrivateIcon />}
        {community?.displayName}
      </Typography.Caption>
    </div>
  );
};
