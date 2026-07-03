import React, { useCallback, useRef } from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CameraButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';

interface CameraButtonProps {
  pageId: string;
  componentId?: string;
  text?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  isVisibleImage?: boolean;
  isVisibleVideo?: boolean;
  isDisabled?: boolean;
  layout?: 'row' | 'column';
  captureMode?: 'environment' | 'user';
  textId?: string;
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
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.75C13.864 15.75 15.375 14.239 15.375 12.375C15.375 10.511 13.864 9 12 9C10.136 9 8.625 10.511 8.625 12.375C8.625 14.239 10.136 15.75 12 15.75Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export function CameraButton({
  pageId = '*',
  componentId = '*',
  text,
  imgIconClassName,
  defaultIconClassName,
  isVisibleImage,
  isVisibleVideo,
  isDisabled,
  layout = 'row',
  captureMode,
  textId = 'amity_social_button_community_setup_camera_button',
  onVideoFileChange,
  onImageFileChange,
}: CameraButtonProps) {
  const elementId = 'camera_button';
  const {
    themeStyles,
    isExcluded,
    config,
    accessibilityId,
    uiReference,
    defaultConfig,
    resolveText,
  } = useAmityElement({ pageId, componentId, elementId });

  const inputRef = useRef<HTMLInputElement | null>(null);

  if (isExcluded) return null;

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const onLoadMedia: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetFiles = e.target.files ? [...e.target.files] : [];
      const isImage = targetFiles.some((file) => file.type.startsWith('image/'));
      const isVideo = targetFiles.some((file) => file.type.startsWith('video/'));

      if (isImage) {
        onImageFileChange?.(targetFiles);
      } else if (isVideo) {
        onVideoFileChange?.(targetFiles);
      }
      e.target.value = '';
    },
    [onImageFileChange, onVideoFileChange],
  );

  const labelText = resolveText(textId) || text || config.text;
  const Label = layout === 'column' ? Typography.Caption : Typography.BodyBold;

  return (
    <Button
      style={themeStyles}
      data-testid={accessibilityId}
      data-layout={layout}
      className={styles.cameraButton}
      onPress={triggerFileInput}
      isDisabled={isDisabled}
    >
      <IconComponent
        defaultIcon={() => (
          <CameraSvg
            data-disabled={isDisabled}
            className={clsx(styles.cameraButton__icon, defaultIconClassName)}
          />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />

      {labelText && <Label className={styles.cameraButton__label}>{labelText}</Label>}

      <input
        ref={inputRef}
        type="file"
        onChange={onLoadMedia}
        accept={
          isVisibleImage && isVisibleVideo
            ? 'video/*,image/*'
            : isVisibleImage
              ? 'image/png,image/jpg'
              : 'video/*'
        }
        capture={
          captureMode ??
          (isVisibleImage && isVisibleVideo ? undefined : isVisibleImage ? 'user' : 'environment')
        }
        className={styles.cameraButton_input}
      />
    </Button>
  );
}
