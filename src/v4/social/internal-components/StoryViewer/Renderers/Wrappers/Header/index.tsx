import React from 'react';
import styles from './Header.module.css';
import Truncate from 'react-truncate-markup';
import Avatar from '~/core/components/Avatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

import { PauseIcon, PlayIcon, VerifiedIcon } from '~/icons';
import { CloseButton, OverflowMenuButton } from '~/v4/social/elements';

const Header: React.FC<
  React.PropsWithChildren<{
    onPlay: () => void;
    onPause: () => void;
    onAction: () => void;
    onClose: () => void;
    onAddStory: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onClickCommunity: () => void;
    avatar?: string;
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
  avatar,
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
          <Avatar
            data-qa-anchor="community_avatar"
            avatar={avatar}
            backgroundImage={communityBackgroundImage}
          />

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
            {isOfficial && <VerifiedIcon className={styles.verifiedBadge} />}
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
        {isHaveActions && (
          <OverflowMenuButton pageId="story_page" componentId="*" onClick={onAction} />
        )}
        <CloseButton pageId="story_page" componentId="*" onClick={onClose} />
      </div>
    </div>
  );
};

export default Header;
