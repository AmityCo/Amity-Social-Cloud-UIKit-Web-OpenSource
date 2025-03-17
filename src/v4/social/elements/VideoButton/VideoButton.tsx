import clsx from 'clsx';
import React from 'react';
import { VideoIcon } from '~/v4/icons/Video';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoButton.module.css';

// todo: test again

type VideoButtonProps = {
  pageId: string;
  onPress?: () => void;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onVideoFileChange?: (files: File[]) => void;
};

export function VideoButton({
  onPress,
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  onVideoFileChange,
  defaultIconClassName,
}: VideoButtonProps) {
  const elementId = 'video_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const triggerFileInput = () => {
    const fileInput = document.getElementById('video-upload') as HTMLInputElement;
    fileInput.click();
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onVideoFileChange?.(e.target.files ? [...e.target.files] : []);
  };

  return (
    <Button
      style={themeStyles}
      className={styles.videoButton}
      data-testid={accessibilityId}
      onPress={onPress ? onPress : triggerFileInput}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => (
          <VideoIcon className={clsx(styles.videoButton__icon, defaultIconClassName)} />
        )}
      />
      {config.text && (
        <Typography.BodyBold className={styles.videoButton__label}>
          {config.text}
        </Typography.BodyBold>
      )}
      {!onPress && (
        <input
          multiple
          type="file"
          accept="video/*"
          id="video-upload"
          onChange={onVideoChange}
          className={styles.videoButton__input}
        />
      )}
    </Button>
  );
}
