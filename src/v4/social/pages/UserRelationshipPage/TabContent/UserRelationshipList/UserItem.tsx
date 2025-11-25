import React, { FC } from 'react';
import styles from './UserItem.module.css';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Popover } from '~/v4/core/components/AriaPopover';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { UserItemMenu } from './UserItemMenu';

type UserItemProps = {
  userId: string;
  pageId?: string;
  componentId?: string;
  isShowMenuButton?: boolean;
};

export const UserItem: FC<UserItemProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
  isShowMenuButton = true,
}) => {
  const { AmityUserRelationshipPageBehavior } = usePageBehavior();
  const { setDrawerData } = useDrawer();

  const { user } = useUser({ userId });

  if (!user) return null;

  return (
    <div className={styles.userItem}>
      <Button
        onPress={() => AmityUserRelationshipPageBehavior?.goToUserProfilePage?.({ userId })}
        className={styles.userItem__buttonWrap}
      >
        <UserAvatar
          pageId={pageId}
          componentId={componentId}
          userId={user.userId}
          className={styles.userItem__avatar}
          shouldRedirectToUserProfile
        />

        <Typography.BodyBold className={styles.userItem__displayName}>
          {user.displayName}
        </Typography.BodyBold>
      </Button>
      {isShowMenuButton && (
        <Popover
          trigger={{
            pageId,
            componentId,
            onClick: ({ closePopover }) =>
              setDrawerData({
                content: <UserItemMenu closePopover={closePopover} user={user} />,
              }),
          }}
        >
          {({ closePopover }) => <UserItemMenu closePopover={closePopover} user={user} />}
        </Popover>
      )}
    </div>
  );
};
