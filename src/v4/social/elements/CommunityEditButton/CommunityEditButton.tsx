import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './CommunityEditButton.module.css';

type CommunityEditButtonProps = {
  pageId?: string;
  componentId?: string;
  isDisabled?: boolean;
  imgClassName?: string;
  defaultClassName?: string;
  onPress?: ButtonProps['onPress'];
};

export const CommunityEditButton = ({
  onPress,
  isDisabled,
  pageId = '*',
  componentId = '*',
}: CommunityEditButtonProps) => {
  const elementId = 'community_edit_button';
  const { config, accessibilityId, themeStyles, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      type="submit"
      size="medium"
      variant="fill"
      color="primary"
      onPress={onPress}
      style={themeStyles}
      isDisabled={isDisabled}
      data-testid={accessibilityId}
      className={styles.communityEditButton__button}
    >
      {resolveText('amity_social_button_edit_user_save_button')}
    </Button>
  );
};
