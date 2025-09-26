import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar/CommunityAvatar';
import styles from './SearchResultGenericItem.module.css';

export type SearchResultType = 'user' | 'community' | 'group' | 'tag';

interface SearchResultGenericItemProps {
  pageId?: string;
  componentId?: string;
  item: any;
  type: SearchResultType;
  onClick?: () => void;
}

export const SearchResultGenericItem = ({
  item,
  type,
  onClick,
  pageId = '*',
  componentId = '*',
}: SearchResultGenericItemProps) => {
  const { onClickUser, goToCommunityProfilePage } = useNavigation();

  const getDisplayName = () => {
    switch (type) {
      case 'user':
        return item.displayName || 'Unknown User';
      case 'community':
        return item.displayName || 'Unknown Community';
      case 'group':
        return item.displayName || item.name || 'Unknown Group';
      case 'tag':
        return `#${item.name || item.displayName || 'Unknown Tag'}`;
      default:
        return 'Unknown Item';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'user':
        return 'User';
      case 'community':
        return 'Community';
      case 'group':
        return 'Group';
      case 'tag':
        return `${item.postCount || 0} posts`;
      default:
        return '';
    }
  };

  const handleClick = () => {
    onClick?.();

    switch (type) {
      case 'user':
        onClickUser(item.userId);
        break;
      case 'community':
        goToCommunityProfilePage(item.communityId);
        break;
      case 'group':
        // Add group navigation logic if available
        break;
      case 'tag':
        // Add tag navigation logic if available
        break;
    }
  };

  const renderAvatar = () => {
    switch (type) {
      case 'user':
        return (
          <UserAvatar
            pageId={pageId}
            userId={item.userId}
            componentId={componentId}
            className={styles.genericItem__avatar}
          />
        );
      case 'community':
        return (
          <CommunityAvatar
            pageId={pageId}
            community={item}
            componentId={componentId}
            className={styles.genericItem__avatar}
          />
        );
      case 'group':
        return (
          <div className={styles.genericItem__avatar}>
            <div className={styles.genericItem__avatarPlaceholder}>
              <Typography.BodyBold>G</Typography.BodyBold>
            </div>
          </div>
        );
      case 'tag':
        return (
          <div className={styles.genericItem__avatar}>
            <div className={styles.genericItem__avatarPlaceholder}>
              <Typography.BodyBold>#</Typography.BodyBold>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getUniqueKey = () => {
    switch (type) {
      case 'user':
        return item.userId;
      case 'community':
        return item.communityId;
      case 'group':
        return item.groupId;
      case 'tag':
        return item.tagId || item.name;
      default:
        return Math.random().toString();
    }
  };

  return (
    <Button key={getUniqueKey()} className={styles.genericItem} onPress={handleClick}>
      <div
        data-testid={`${pageId}/${componentId}/search_${type}_avatar`}
        className={styles.genericItem__leftPane}
      >
        {renderAvatar()}
      </div>
      <div className={styles.genericItem__rightPane}>
        <div className={styles.genericItem__displayName}>
          <Typography.BodyBold
            className={styles.genericItem__displayName__text}
            data-testid={`${pageId}/${componentId}/search_${type}_name`}
          >
            {getDisplayName()}
          </Typography.BodyBold>
          {type === 'user' && item.isBrand && (
            <div className={styles.genericItem__brandIcon__container}>
              <BrandBadge className={styles.genericItem__brandIcon} />
            </div>
          )}
        </div>
        <Typography.Body className={styles.genericItem__subtitle}>{getSubtitle()}</Typography.Body>
      </div>
    </Button>
  );
};
