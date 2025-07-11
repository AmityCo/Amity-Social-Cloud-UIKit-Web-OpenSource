import React from 'react';
import clsx from 'clsx';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import styles from './CreateNewClipButton.module.css';
import { CameraTranparent } from '~/v4/icons/CameraTranparent';

type CreateNewClipButtonProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const CreateNewClipButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
  isDisabled = false,
  imgIconClassName,
  defaultIconClassName,
}: CreateNewClipButtonProps) => {
  const elementId = 'create_new_clip_button';

  const { accessibilityId, themeStyles, config, uiReference, defaultConfig, isExcluded } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      style={themeStyles}
      data-testid={accessibilityId}
      onPress={onClick}
      isDisabled={isDisabled}
      variant="text"
    >
      <IconComponent
        defaultIcon={() => (
          <CameraTranparent
            className={clsx(styles.createNewClipButton__icon, defaultIconClassName)}
          />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.image}
        configIconName={config.image}
      />
    </Button>
  );
};
