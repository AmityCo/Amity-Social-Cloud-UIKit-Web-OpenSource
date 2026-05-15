import React from 'react';
import styles from './UserFollowing.module.css';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import millify from 'millify';
import useSDK from '~/v4/core/hooks/useSDK';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

interface UserFollowingProps {
  userId: string;
  pageId?: string;
  componentId?: string;
  followStatus: Amity.FollowStatus['status'] | null;
  isCurrentUser?: boolean;
}

export const UserFollowing: React.FC<UserFollowingProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
  followStatus,
  isCurrentUser,
}) => {
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();
  const { followingCount } = useFollowCount(userId);
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const elementId = 'user_following';
  const { themeStyles, config, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      data-testid={accessibilityId}
      style={themeStyles}
      onPress={() =>
        handleUserProfileBehavior({
          followStatus,
          allowNonFollower: false,
          isCurrentUser,
          defaultBehavior: () =>
            AmityUserProfileHeaderComponentBehavior?.goToUserRelationshipPage?.({
              userId,
              selectedTab: UserRelationshipPageTabs.FOLLOWING,
            }),
        })
      }
    >
      <Typography.BodyBold className={styles.userFollowing__count}>
        {millify(followingCount)}
      </Typography.BodyBold>

      <Typography.Caption className={styles.userFollowing__label}>
        {resolveText('amity_social_button_user_profile_following')}
      </Typography.Caption>
    </Button>
  );
};
