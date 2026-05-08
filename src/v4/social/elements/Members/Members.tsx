import clsx from 'clsx';

import React from 'react';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';
import { Members as MembersIcon } from '~/v4/icons/Members';
import { Typography } from '~/v4/core/components';
import styles from './Members.module.css';

type MembersProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const Members = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: MembersProps) => {
  const elementId = 'members';
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
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.members__button}
    >
      <div className={styles.members__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <MembersIcon className={clsx(styles.members__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />

        <Typography.Body>
          {resolveText('amity_social_label_community_members_label')}
        </Typography.Body>
      </div>
      <ChevronRight className={styles.members__angleRight} />
    </Button>
  );
};
