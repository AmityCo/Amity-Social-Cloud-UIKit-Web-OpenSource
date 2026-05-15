import React from 'react';
import styles from './CommunityAddMemberButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { Plus } from '~/v4/icons/Plus';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

interface CommunityAddMemberButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: ButtonProps['onPress'];
  isDisabled?: boolean;
}

export const CommunityAddMemberButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
  isDisabled,
}: CommunityAddMemberButtonProps) => {
  const elementId = 'community_add_member_button';
  const {
    config,
    accessibilityId,
    themeStyles,
    isExcluded,
    defaultConfig,
    uiReference,
    resolveText,
  } = useAmityElement({
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
      className={styles.communityAddMemberButton__button}
      isDisabled={isDisabled}
      type="button"
    >
      <div className={styles.communityAddMemberButton__iconWrap}>
        <IconComponent
          defaultIcon={() => (
            <Plus className={clsx(styles.communityAddMemberButton__icon, defaultClassName)} />
          )}
          imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
          defaultIconName={defaultConfig.image}
          configIconName={config.image}
        />
      </div>
      <Typography.Body className={styles.communityAddMemberButton__text}>
        {resolveText('amity_social_community_setup_page_community_add_member_button_text')}
      </Typography.Body>
    </Button>
  );
};
