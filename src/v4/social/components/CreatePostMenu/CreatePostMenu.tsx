import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useEventPermission } from '~/v4/social/features/events/hooks';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';
import { CreateLivestreamButton } from '~/v4/social/elements/CreateLivestreamButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { CreateEventButton } from '~/v4/social/elements/CreateEventButton';
import { useRedirectEventTargetSelectionPage } from '~/v4/social/features/events/hooks';
import styles from './CreatePostMenu.module.css';

type CreatePostMenuProps = {
  pageId: string;
};

export function CreatePostMenu({ pageId }: CreatePostMenuProps) {
  const componentId = 'create_post_menu';

  const { isDesktop } = useResponsive();
  const { hasStoryPermission } = useStoryPermission();
  const { hasCreateEventPermission } = useEventPermission();
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();
  const { redirectEventTargetSelectionPage } = useRedirectEventTargetSelectionPage();

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
      <CreateLivestreamButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToLivestreamUnsupportedPage?.()}
      />
      {hasCreateEventPermission && (
        <CreateEventButton
          pageId={pageId}
          componentId={componentId}
          onPress={redirectEventTargetSelectionPage}
        />
      )}
    </div>
  );
}
