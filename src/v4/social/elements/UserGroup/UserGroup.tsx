import React from 'react';
import styles from './UserGroup.module.css';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import millify from 'millify';
// import useUserGroups from '~/v4/social/hooks/useUserGroups';

interface UserGroupProps {
  userId: string;
  pageId?: string;
  componentId?: string;
}

export const UserGroup: React.FC<UserGroupProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
}) => {
  //   const { groupCount } = useUserGroups(userId);
  //   const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const elementId = 'user_group';
  const { themeStyles, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.userGroup__container}
      onPress={() => {
        // this will anvigate to groups TBD
        console.log('Navigate to groups for user:', userId);
      }}
    >
      <Typography.BodyBold className={styles.userGroup__count}>
        {/* {millify(groupCount)}   */} 0 {/* mock value */}
      </Typography.BodyBold>
      {config.text && (
        <Typography.Caption className={styles.userGroup__label}>{config.text}</Typography.Caption>
      )}
    </Button>
  );
};
