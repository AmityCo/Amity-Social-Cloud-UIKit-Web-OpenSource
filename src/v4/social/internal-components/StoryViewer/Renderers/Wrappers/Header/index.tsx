import React from 'react';
import Truncate from 'react-truncate-markup';
import { PauseIcon, PlayIcon } from '~/icons';
import { CloseButton, OverflowMenuButton } from '~/v4/social/elements';
import Verified from '~/v4/social/icons/verified';
import clsx from 'clsx';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';

import styles from './Header.module.css';

const Header: React.FC<
  React.PropsWithChildren<{
    onPlay: () => void;
    onPause: () => void;
    onAction: () => void;
    onClose: () => void;
    onClickCommunity: () => void;
    community?: Amity.Community | null;
    heading?: React.ReactNode;
    subheading?: React.ReactNode;
    isOfficial?: boolean;
    isPaused?: boolean;
    isHaveActions?: boolean;
    haveStoryPermission?: boolean;
    onMute?: () => void;
    onUnmute?: () => void;
    addStoryButton?: React.ReactNode;
  }>
> = ({
  community,
  heading,
  subheading,
  isHaveActions,
  isOfficial,
  isPaused,
  onPlay,
  onPause,
  onAction,
  onClose,
  onClickCommunity,
  haveStoryPermission,
  addStoryButton,
}) => {
  return (
    <div className={styles.viewStoryHeaderContainer}>
      <div className={styles.viewStoryHeadingInfoContainer}>
        <div className={styles.avatarContainer}>
          <CommunityAvatar pageId="story_page" community={community} />
          {haveStoryPermission && addStoryButton}
        </div>
        <div className={styles.viewStoryInfoContainer}>
          <div className={styles.viewStoryHeading}>
            <Truncate lines={1}>
              <div
                className={styles.viewStoryHeadingTitle}
                data-qa-anchor="community_display_name"
                onClick={onClickCommunity}
              >
                {heading}
              </div>
            </Truncate>
            {isOfficial && <Verified className={styles.verifiedBadge} />}
          </div>
          <span className={styles.viewStorySubHeading}>{subheading}</span>
        </div>
      </div>
      <div className={styles.viewStoryHeaderListActionsContainer}>
        {isPaused ? (
          <PlayIcon
            className={styles.playStoryButton}
            data-qa-anchor="play_button"
            onClick={onPlay}
          />
        ) : (
          <PauseIcon
            className={styles.pauseStoryButton}
            data-qa-anchor="pause_button"
            onClick={onPause}
          />
        )}
        {isHaveActions && <OverflowMenuButton pageId="story_page" onPress={onAction} />}
        <CloseButton
          defaultClassName={clsx(styles.closeButton)}
          pageId="story_page"
          onPress={onClose}
        />
      </div>
    </div>
  );
};

export default Header;
