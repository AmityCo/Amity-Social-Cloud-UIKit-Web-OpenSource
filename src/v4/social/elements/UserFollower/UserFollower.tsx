import React from 'react';
import styles from './UserFollower.module.css';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import millify from 'millify';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

interface UserFollowerProps {
  userId: string;
  pageId?: string;
  componentId?: string;
  followStatus: Amity.FollowStatus['status'] | null;
  isCurrentUser?: boolean;
}

export const UserFollower: React.FC<UserFollowerProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
  followStatus,
  isCurrentUser,
}) => {
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();
  const { followerCount } = useFollowCount(userId);
  const elementId = 'user_follower';
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
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
          isCurrentUser,
          allowNonFollower: false,
          defaultBehavior: () =>
            AmityUserProfileHeaderComponentBehavior?.goToUserRelationshipPage?.({
              userId,
              selectedTab: UserRelationshipPageTabs.FOLLOWER,
            }),
        })
      }
    >
      <Typography.BodyBold className={styles.userFollower__count}>
        {millify(followerCount)}
      </Typography.BodyBold>
      {resolveText('amity_social_button_user_profile_follower') && (
        <Typography.Caption className={styles.userFollower__label}>
          {resolveText('amity_social_button_user_profile_follower')}
        </Typography.Caption>
      )}
    </Button>
  );
};
