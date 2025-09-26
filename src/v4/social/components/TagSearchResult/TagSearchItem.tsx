import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './TagSearchItem.module.css';

interface TagSearchItemProps {
  pageId?: string;
  tag: any;
  componentId?: string;
  onClick?: () => void;
}

export const TagSearchItem = ({
  tag,
  onClick,
  pageId = '*',
  componentId = '*',
}: TagSearchItemProps) => {
  const { onClickUser } = useNavigation();

  return (
    <Button
      key={tag.tagId || tag.name}
      className={styles.tagItem}
      onPress={() => {
        onClick?.();
      }}
    >
      <div
        data-testid={`${pageId}/${componentId}/search_tag_icon`}
        className={styles.tagItem__leftPane}
      >
        <div className={styles.tagItem__icon}>
          <Typography.BodyBold className={styles.tagItem__iconText}>#</Typography.BodyBold>
        </div>
      </div>
      <div className={styles.tagItem__rightPane}>
        <div className={styles.tagItem__tagName}>
          <Typography.BodyBold
            className={styles.tagItem__tagName__text}
            data-testid={`${pageId}/${componentId}/search_tagname`}
          >
            #{tag.name || tag.displayName || 'Tag Name'}
          </Typography.BodyBold>
        </div>
        <Typography.Body className={styles.tagItem__postCount}>
          {tag.postCount || 0} posts
        </Typography.Body>
      </div>
    </Button>
  );
};
