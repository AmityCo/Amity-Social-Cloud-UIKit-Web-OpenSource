import React, { useRef } from 'react';
import styles from './UserSearchResult.module.css';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserAvatar } from '../../internal-components/UserAvatar/UserAvatar';
import { Typography } from '~/v4/core/components/index';

interface UserSearchResultProps {
  pageId?: string;
  userCollection: Amity.User[];
  onLoadMore: () => void;
}

export const UserSearchResult = ({
  pageId = '*',
  userCollection = [],
  onLoadMore,
}: UserSearchResultProps) => {
  const componentId = 'user_search_result';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const intersectionRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), ref: intersectionRef });

  return (
    <div className={styles.userSearchResult} style={themeStyles}>
      {userCollection.map((user) => (
        <div key={user.userId} className={styles.userSearchResult__userItem}>
          <div className={styles.userSearchResult__userItem__leftPane}>
            <UserAvatar
              userId={user.userId}
              className={styles.userSearchResult__userItem__avatar}
            />
          </div>
          <div className={styles.userSearchResult__userItem__rightPane}>
            <div className={styles.userItem__userName}>
              <Typography.BodyBold className={styles.userItem__userName__text}>
                {user.displayName}
              </Typography.BodyBold>
            </div>
          </div>
        </div>
      ))}
      <div ref={intersectionRef} />
    </div>
  );
};
