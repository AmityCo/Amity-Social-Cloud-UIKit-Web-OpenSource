import React, { useCallback, useState } from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CameraButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';

interface CameraButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  isVisibleImage?: boolean;
  isVisibleVideo?: boolean;
  onVideoFileChange?: (files: File[]) => void;
  onImageFileChange?: (files: File[]) => void;
}

const CameraSvg = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M19.5 19.5H4.5C4.10218 19.5 3.72064 19.342 3.43934 19.0607C3.15804 18.7794 3 18.3978 3 18V7.5C3 7.10218 3.15804 6.72064 3.43934 6.43934C3.72064 6.15804 4.10218 6 4.5 6H7.49945L8.99945 3.75H14.9995L16.4995 6H19.5C19.8978 6 20.2794 6.15804 20.5607 6.43934C20.842 6.72064 21 7.10218 21 7.5V18C21 18.3978 20.842 18.7794 20.5607 19.0607C20.2794 19.342 19.8978 19.5 19.5 19.5Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 15.75C13.864 15.75 15.375 14.239 15.375 12.375C15.375 10.511 13.864 9 12 9C10.136 9 8.625 10.511 8.625 12.375C8.625 14.239 10.136 15.75 12 15.75Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export function CameraButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  isVisibleImage,
  isVisibleVideo,
  onVideoFileChange,
  onImageFileChange,
}: CameraButtonProps) {
  const elementId = 'camera_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const triggerFileInput = () => {
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    fileInput.click();
  };

  const onLoadMedia: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const targetFiles = e.target.files ? [...e.target.files] : [];
    const isImage = targetFiles.some((file) => file.type.startsWith('image/'));
    const isVideo = targetFiles.some((file) => file.type.startsWith('video/'));

    if (isImage) {
      onImageFileChange?.(e.target.files ? [...e.target.files] : []);
    } else if (isVideo) {
      onVideoFileChange?.(e.target.files ? [...e.target.files] : []);
    }
  }, []);

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    onImageFileChange?.(e.target.files ? [...e.target.files] : []);
  }, []);

  const onVideoChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    onImageFileChange?.(e.target.files ? [...e.target.files] : []);
  }, []);

  return (
    <Button
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.cameraButton}
      onPress={triggerFileInput}
    >
      <IconComponent
        defaultIcon={() => (
          <CameraSvg className={clsx(styles.cameraButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      {config.text && <Typography.BodyBold>{config.text}</Typography.BodyBold>}

      {isVisibleImage && !isVisibleVideo && (
        <input
          type="file"
          onChange={onImageChange}
          id="upload"
          accept="image/*"
          className={styles.cameraButton_input}
        />
      )}

      {!isVisibleImage && isVisibleVideo && (
        <input
          type="file"
          onChange={onVideoChange}
          id="upload"
          accept="video/*"
          className={styles.cameraButton_input}
        />
      )}

      {isVisibleVideo && isVisibleVideo && (
        <input
          type="file"
          onChange={onLoadMedia}
          id="upload"
          accept="image/*,video/*"
          className={styles.cameraButton_input}
        />
      )}
    </Button>
  );
}
