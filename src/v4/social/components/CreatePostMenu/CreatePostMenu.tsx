import React from 'react';
import styles from './CreatePostMenu.module.css';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

interface CreatePostMenuProps {
  pageId: string;
}

export function CreatePostMenu({ pageId }: CreatePostMenuProps) {
  const componentId = 'create_post_menu';

  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();

  return (
    <div className={styles.createPostMenu}>
      <CreatePostButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToSelectPostTargetPage?.()}
      />
      <CreateStoryButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToStoryTargetSelectionPage?.()}
      />
    </div>
  );
}
