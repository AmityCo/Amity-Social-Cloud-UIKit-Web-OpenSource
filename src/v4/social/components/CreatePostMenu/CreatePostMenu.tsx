import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useEventPermission } from '~/v4/social/features/events/hooks';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';
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
