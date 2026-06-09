import clsx from 'clsx';
import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ImageIcon } from '~/v4/icons/Image';
import { FileTrigger } from 'react-aria-components';
import styles from './MediaButton.module.css';

type MediaButtonProps = {
  pageId: string;
  componentId?: string;
  text?: string;
  onPress?: () => void;
  isSingleUpload?: boolean;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onMediaFileChange?: (files: File[]) => void;
  isDisabled?: boolean;
  layout?: 'row' | 'column';
};

export function MediaButton({
  onPress,
  pageId = '*',
  text,
  imgIconClassName,
  componentId = '*',
  onMediaFileChange,
  defaultIconClassName,
  isSingleUpload = false,
  isDisabled = false,
  layout = 'row',
}: MediaButtonProps) {
  const elementId = 'media_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const onChangeMedia = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    onMediaFileChange?.(fileArray);
  };

  const labelText = text ?? config.text;
  const Label = layout === 'column' ? Typography.Caption : Typography.BodyBold;

  const button = (
    <Button
      type="button"
      onPress={onPress}
      style={themeStyles}
      data-layout={layout}
      className={styles.mediaButton}
      isDisabled={isDisabled}
      data-testid={accessibilityId}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => (
          <ImageIcon
            data-disabled={isDisabled}
            className={clsx(styles.mediaButton__icon, defaultIconClassName)}
          />
        )}
      />
      {labelText && <Label className={styles.mediaButton__label}>{labelText}</Label>}
    </Button>
  );

  const mediaUpload = (
    <FileTrigger
      data-testid={accessibilityId}
      allowsMultiple={!isSingleUpload}
      onSelect={(files) => onChangeMedia(files)}
      acceptedFileTypes={['image/*', 'video/*']}
    >
      {button}
    </FileTrigger>
  );

  return onPress ? button : mediaUpload;
}
