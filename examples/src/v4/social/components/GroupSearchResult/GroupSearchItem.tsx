import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './GroupSearchItem.module.css';

interface GroupSearchItemProps {
  pageId?: string;
  group: any;
  componentId?: string;
  onClick?: () => void;
}

export const GroupSearchItem = ({
  group,
  onClick,
  pageId = '*',
  componentId = '*',
}: GroupSearchItemProps) => {
  const { onClickUser } = useNavigation();

  return (
    <Button
      key={group.groupId}
      className={styles.groupItem}
      onPress={() => {
        onClick?.();
      }}
    >
      <div
        data-testid={`${pageId}/${componentId}/search_group_avatar`}
        className={styles.groupItem__leftPane}
      >
        <div className={styles.groupItem__avatar}>
          <div className={styles.groupItem__avatarPlaceholder}>
            <Typography.BodyBold>G</Typography.BodyBold>
          </div>
        </div>
      </div>
      <div className={styles.groupItem__rightPane}>
        <div className={styles.groupItem__groupName}>
          <Typography.BodyBold
            className={styles.groupItem__groupName__text}
            data-testid={`${pageId}/${componentId}/search_groupname`}
          >
            {group.displayName || group.name || 'Group Name'}
          </Typography.BodyBold>
        </div>
        <Typography.Body className={styles.groupItem__description}>
          {group.description || 'Group description'}
        </Typography.Body>
      </div>
    </Button>
  );
};
