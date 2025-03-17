import clsx from 'clsx';
import React from 'react';
import { Pen } from '~/v4/icons/Pen';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';
import styles from './EditProfile.module.css';

type EditProfileProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const EditProfile = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: EditProfileProps) => {
  const elementId = 'edit_profile';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.editProfile__button}
    >
      <div className={styles.editProfile__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <Pen className={clsx(styles.editProfile__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />
        {config.text && <Typography.Body>{config.text}</Typography.Body>}
      </div>
      <ChevronRight className={styles.editProfile__angleRight} />
    </Button>
  );
};
