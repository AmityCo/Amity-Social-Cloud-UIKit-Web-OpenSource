import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useAmityComponent, useAmityElement } from '~/v4/core/hooks/uikit';
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
  useAmityComponent({ pageId, componentId });

  // The sheet is chrome now, not Post's. Story needs only Community and Event
  // only Community, so both outlive Post — and this sheet is the only place
  // either can be started, so it has to survive Post off.
  //
  // What goes with Post is the post family. A poll and a livestream are posts
  // underneath, but their ids answer to Poll and Live, which survive Post off,
  // so their own gate is not enough. The sheet asks whether Post's own entry
  // survived and takes the family with it — one existing id read as a value,
  // rather than a second owner on every id.
  const postEntry = useAmityElement({ pageId, componentId, elementId: 'create_post_button' });
  const postFamilyGone = postEntry.isExcluded;

  const { isDesktop } = useResponsive();
  const { hasStoryPermission } = useStoryPermission();
  const { hasCreateEventPermission } = useEventPermission();
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();
  const { redirectEventTargetSelectionPage } = useRedirectEventTargetSelectionPage();

  return (
    <div className={styles.createPostMenu} data-collapsed={postFamilyGone}>
      <CreatePostButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => AmityCreatePostMenuComponentBehavior?.goToSelectPostTargetPage?.()}
      />
      {!postFamilyGone && (
        <CreatePollButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => AmityCreatePostMenuComponentBehavior?.goToSelectPollPostTargetPage?.()}
        />
      )}
      {hasStoryPermission && (
        <CreateStoryButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => AmityCreatePostMenuComponentBehavior?.goToStoryTargetSelectionPage?.()}
        />
      )}
      {!isDesktop && !postFamilyGone && (
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
      {!postFamilyGone && (
        <CreateLivestreamButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => AmityCreatePostMenuComponentBehavior?.goToLivestreamUnsupportedPage?.()}
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
