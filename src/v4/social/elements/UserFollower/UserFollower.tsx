import React from 'react';
import styles from './UserFollower.module.css';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import millify from 'millify';

interface UserFollowerProps {
  userId: string;
  pageId?: string;
  componentId?: string;
}

export const UserFollower: React.FC<UserFollowerProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
}) => {
  const { followerCount } = useFollowCount(userId);
  const elementId = 'user_follower';
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const { themeStyles, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Button
      className={styles.userFollower__container}
      data-testid={accessibilityId}
      style={themeStyles}
      onPress={() => {
        AmityUserProfileHeaderComponentBehavior.goToUserRelationshipPage?.({
          userId,
          selectedTab: UserRelationshipPageTabs.FOLLOWER,
        });
      }}
    >
      <Typography.BodyBold className={styles.userFollower__count}>
        {millify(followerCount)}
      </Typography.BodyBold>
      {config.text && (
        <Typography.Caption className={styles.userFollower__label}>
          {config.text}
        </Typography.Caption>
      )}
    </Button>
  );
};
