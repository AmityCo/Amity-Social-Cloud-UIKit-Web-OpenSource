import React from 'react';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton/Button';
import CloseIcon from '~/v4/icons/Close';
import Muted from '~/v4/icons/Muted';
import UnMutedOutlined from '~/v4/icons/UnMutedOutlined';
import { MenuButton } from '~/v4/social/elements';
import styles from './VideoHeader.module.css';

interface VideoHeaderProps {
  onClose?: () => void;
  onClickMute?: () => void;
  onClickMenu?: () => void;
  isMuted?: boolean;
}

export const VideoHeader: React.FC<VideoHeaderProps> = ({
  onClose,
  onClickMute,
  onClickMenu,
  isMuted = false,
}) => {
  return (
    <div className={styles.videoHeader__videoHeader}>
      <div className={styles.videoHeader__leftContainer}>
        <Button
          variant="default"
          icon={<CloseIcon />}
          onPress={onClose}
          className={styles.videoHeader__iconButton}
          iconClassName={styles.videoHeader__icon}
          aria-label="Close"
        />
      </div>
      <div className={styles.videoHeader__rightContainer}>
        <Button
          variant="default"
          icon={isMuted ? <Muted /> : <UnMutedOutlined />}
          onPress={onClickMute}
          className={styles.videoHeader__iconButton}
          iconClassName={styles.videoHeader__icon}
          aria-label={
            isMuted
              ? useString('amity_social_button_unmute')
              : useString('amity_social_button_mute')
          }
          data-muted={isMuted}
        />
        {onClickMenu && (
          <MenuButton
            variant="filled"
            className={styles.videoHeader__menuButton}
            iconClassName={styles.videoHeader__menuButton__icon}
            onClick={() => onClickMenu?.()}
          />
        )}
      </div>
    </div>
  );
};

export default VideoHeader;
