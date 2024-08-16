import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoButton.module.css';
import clsx from 'clsx';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Button } from '~/v4/core/natives/Button';

interface VideoButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onVideoFileChange?: (files: File[]) => void;
}

const VideoButtonSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-miterlimit="10"
      />
      <path
        d="M16 12L10 8V16L16 12Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export function VideoButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onVideoFileChange,
}: VideoButtonProps) {
  const elementId = 'video_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const { confirm } = useConfirmContext();

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
      data-qa-anchor={accessibilityId}
      className={styles.videoButton}
      onPress={triggerFileInput}
    >
      <IconComponent
        defaultIcon={() => (
          <VideoButtonSvg className={clsx(styles.videoButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      {config.text && <Typography.BodyBold>{config.text}</Typography.BodyBold>}

      <input
        type="file"
        accept="video/*"
        onChange={onVideoChange}
        multiple
        id="video-upload"
        className={styles.videoButton__input}
      />
    </Button>
  );
}
