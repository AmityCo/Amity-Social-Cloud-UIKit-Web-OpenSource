import React from 'react';
import styles from './SubmitButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Plus } from '~/v4/icons/Plus';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';
import { Button } from '~/v4/core/components/AriaButton';

interface SubmitButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  textButton?: string;
  className?: string;
}

export const SubmitButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
  isDisabled,
  textButton,
  className,
}: SubmitButtonProps) => {
  const elementId = 'submit_button';
  const { config, accessibilityId, themeStyles, isExcluded, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      onPress={onPress}
      data-testid={accessibilityId}
      style={themeStyles}
      className={clsx(styles.submitButton__button, className)}
      data-isDisabled={isDisabled}
      isDisabled={isDisabled}
      type="button"
    >
      {config.image && (
        <div className={styles.submitButton__iconWrap}>
          <IconComponent
            defaultIcon={() => (
              <Plus className={clsx(styles.submitButton__icon, defaultClassName)} />
            )}
            imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
            defaultIconName={defaultConfig.image}
            configIconName={config.image}
          />
        </div>
      )}

      <Typography.BodyBold className={styles.submitButton__text}>
        {textButton ?? 'Done'}
      </Typography.BodyBold>
    </Button>
  );
};
