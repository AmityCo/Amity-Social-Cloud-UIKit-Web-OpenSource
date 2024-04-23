import React from 'react';
import useImage from '~/core/hooks/useImage';
import useCommunity from '~/social/hooks/useCommunity';
import StoryRing from './StoryRing';
import { PrivateIcon } from '~/social/components/community/Name/styles';
import { Verified } from '~/icons';
import styles from './StoryTabItem.module.css';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import { Typography } from '~/v4/core/components';

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
        {community?.isOfficial && (
          <Verified width={24} height={24} className={styles.verifiedIcon} />
        )}
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
