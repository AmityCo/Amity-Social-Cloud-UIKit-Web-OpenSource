import React from 'react';
import styles from './UserFollowing.module.css';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import millify from 'millify';

interface UserFollowingProps {
  userId: string;
  pageId?: string;
  componentId?: string;
}

export const UserFollowing: React.FC<UserFollowingProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
}) => {
  const { followingCount } = useFollowCount(userId);
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const elementId = 'user_following';
  const { themeStyles, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.userFollowing__container}
      onPress={() =>
        AmityUserProfileHeaderComponentBehavior?.goToUserRelationshipPage?.({
          userId,
          selectedTab: UserRelationshipPageTabs.FOLLOWING,
        })
      }
    >
      <Typography.BodyBold className={styles.userFollowing__count}>
        {millify(followingCount)}
      </Typography.BodyBold>
      {config.text && (
        <Typography.Caption className={styles.userFollowing__label}>
          {' '}
          {config.text}
        </Typography.Caption>
      )}
    </Button>
  );
};
