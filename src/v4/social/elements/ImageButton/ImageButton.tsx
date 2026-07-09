import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ImageButton.module.css';
import { ImageIcon } from '~/v4/icons/Image';
import { FileTrigger } from 'react-aria-components';

type ImageButtonProps = {
  pageId: string;
  componentId?: string;
  text?: string;
  onPress?: () => void;
  isSingleUpload?: boolean;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onImageFileChange?: (files: File[]) => void;
  isDisabled?: boolean;
  textId?: string;
};

export function ImageButton({
  onPress,
  pageId = '*',
  text,
  imgIconClassName,
  componentId = '*',
  onImageFileChange,
  defaultIconClassName,
  isSingleUpload = false,
  isDisabled = false,
  textId = 'amity_social_button_post_composer_image_button',
}: ImageButtonProps) {
  const elementId = 'image_button';
  const {
    themeStyles,
    isExcluded,
    config,
    accessibilityId,
    uiReference,
    defaultConfig,
    resolveText,
  } = useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const onChangeImage = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    onImageFileChange?.(fileArray);
  };

  const button = (
    <Button
      type="button"
      onPress={onPress}
      style={themeStyles}
      className={styles.imageButton}
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
            className={clsx(styles.imageButton__icon, defaultIconClassName)}
          />
        )}
      />
      {(resolveText(textId) || text || config.text) && (
        <Typography.BodyBold>{resolveText(textId) || text || config.text}</Typography.BodyBold>
      )}
    </Button>
  );

  const imageUpload = (
    <FileTrigger
      data-testid={accessibilityId}
      allowsMultiple={!isSingleUpload}
      onSelect={(files) => onChangeImage(files)}
      acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
    >
      {button}
    </FileTrigger>
  );

  return onPress ? button : imageUpload;
}
