import React from 'react';
import styles from './UserName.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import Truncate from 'react-truncate-markup';

interface UserNameProps {
  name: string;
  pageId?: string;
  componentId?: string;
}

export const UserName: React.FC<UserNameProps> = ({ name, pageId = '*', componentId = '*' }) => {
  const elementId = 'user_name';
  const { isExcluded, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div className={styles.userName__displayName} data-testid={accessibilityId}>
      <Typography.Headline>
        <Truncate lines={4}>
          <div className={styles.userName__displayName__text}>{name}</div>
        </Truncate>
      </Typography.Headline>
    </div>
  );
};
