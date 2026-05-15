import React, { useState } from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import styles from './VideoMenu.module.css';
import Check from '~/v4/icons/Check';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import { PlaybackSpeed } from '~/v4/icons/PlaybackSpeed';
import { PictureInPicture } from '~/v4/icons/PictureInPicture';
import { ExitPictureInPicture } from '~/v4/icons/ExitPictureInPicture';
import clsx from 'clsx';

type VideoMenuProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  closePopover: () => void;
};

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function VideoMenu({ videoRef, closePopover }: VideoMenuProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(videoRef.current?.playbackRate || 1);

  const handlePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
    closePopover();
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setCurrentSpeed(speed);
    setShowSpeedMenu(false);
    closePopover();
  };

  if (showSpeedMenu) {
    return (
      <div className={styles.videoMenu}>
        <Button className={styles.videoMenu__header} onPress={() => setShowSpeedMenu(false)}>
          <ArrowLeft className={styles.videoMenu__header__icon} />
          <Typography.BodyBold>{useString('amity_social_button_options')}</Typography.BodyBold>
        </Button>
        {PLAYBACK_SPEEDS.map((speed) => (
          <Button
            key={speed}
            className={clsx(styles.videoMenu__item, styles.videoMenu__item__speedItem)}
            onPress={() => handleSpeedChange(speed)}
          >
            <Typography.BodyBold>
              {speed === 1 ? useString('amity_social_normal') : `${speed}x`}
            </Typography.BodyBold>
            <div className={styles.videoMenu__item__checkContainer}>
              {currentSpeed === speed && <Check className={styles.videoMenu__item__check} />}
            </div>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.videoMenu}>
      <Button className={styles.videoMenu__item} onPress={() => setShowSpeedMenu(true)}>
        <PlaybackSpeed className={styles.videoMenu__item__icon} />
        <Typography.BodyBold>{useString('amity_social_playback_speed')}</Typography.BodyBold>
      </Button>
      {document.pictureInPictureEnabled && (
        <Button className={styles.videoMenu__item} onPress={handlePictureInPicture}>
          {document.pictureInPictureElement ? (
            <ExitPictureInPicture className={styles.videoMenu__item__icon} />
          ) : (
            <PictureInPicture className={styles.videoMenu__item__icon} />
          )}
          <Typography.BodyBold>
            {document.pictureInPictureElement
              ? useString('amity_social_exit_picture_in_picture')
              : useString('amity_social_picture_in_picture')}
          </Typography.BodyBold>
        </Button>
      )}
    </div>
  );
}
