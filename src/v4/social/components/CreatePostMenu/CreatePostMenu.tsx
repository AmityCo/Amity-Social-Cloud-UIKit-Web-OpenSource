import React from 'react';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import styles from './CreatePostMenu.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type CreatePostMenuProps = {
  pageId: string;
};

export function CreatePostMenu({ pageId }: CreatePostMenuProps) {
  const componentId = 'create_post_menu';

  const { hasStoryPermission } = useStoryPermission();
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();
  const { isDesktop } = useResponsive();

  return (
    <div className={styles.createPostMenu}>
      <CreatePostButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToSelectPostTargetPage?.()}
      />
      <CreatePollButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToSelectPollPostTargetPage?.()}
      />
      {hasStoryPermission && (
        <CreateStoryButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => AmityCreatePostMenuComponentBehavior?.goToStoryTargetSelectionPage?.()}
        />
      )}
      {!isDesktop && (
        <CreateClipButton
          pageId={pageId}
          componentId={componentId}
          onClick={() =>
            AmityCreatePostMenuComponentBehavior?.goToSelectClipPostTargetPage?.({
              isClipPost: true,
            })
          }
        />
      )}
    </div>
  );
}
