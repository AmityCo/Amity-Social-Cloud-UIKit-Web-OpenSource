import React from 'react';
import styles from './CreatePostMenu.module.css';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';

interface CreatePostMenuProps {
  pageId: string;
}

export function CreatePostMenu({ pageId }: CreatePostMenuProps) {
  const componentId = 'create_post_menu';
  return (
    <div className={styles.createPostMenu}>
      <CreatePostButton pageId={pageId} componentId={componentId} />
      <CreateStoryButton pageId={pageId} componentId={componentId} />
    </div>
  );
}
