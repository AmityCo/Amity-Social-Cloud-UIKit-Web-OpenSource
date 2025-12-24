import useSDK from '~/v4/core/hooks/useSDK';
import { Button } from '~/v4/core/natives/Button';
import { Title } from '~/v4/social/elements/Title';
import { FileTrigger } from 'react-aria-components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PollButton } from '~/v4/social/elements/PollButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useEventPermission } from '~/v4/social/features/events/hooks';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import { EventButton } from '~/v4/social/elements/EventButton/EventButton';
import { StoryButton } from '~/v4/social/elements/StoryButton/StoryButton';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import { useRedirectEventTargetSelectionPage } from '~/v4/social/features/events/hooks';
import styles from './PostComposer.module.css';
import { LivestreamButton } from '~/v4/social/elements/LivestreamButton';
import { LivestreamTargetSelectionPage } from '~/v4/social/features/livestream/pages/LivestreamTargetSelectionPage';

type PostComposerProps = {
  pageId?: string;
  communityId?: string;
  isDisableStory?: boolean;
  isDisableEvent?: boolean;
  onClickPost?: () => void;
  onClickPoll?: () => void;
  onClickLivestream?: () => void;
  onClickEvent?: () => void;
  onSelectFile?: (files: FileList | null) => void;
};

export function PostComposer({
  pageId = '*',
  communityId,
  onClickPost,
  onClickPoll,
  onClickLivestream,
  onSelectFile,
  onClickEvent,
  isDisableStory = false,
  isDisableEvent = false,
}: PostComposerProps) {
  const componentId = 'post_composer';

  const { currentUserId, isVisitorOrBot } = useSDK();
  const { openPopup } = usePopupContext();
  const { user } = useUser({ userId: currentUserId, shouldCall: !isVisitorOrBot });
  const { hasStoryPermission } = useStoryPermission(communityId);
  const { hasCreateEventPermission } = useEventPermission(communityId);
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { redirectEventTargetSelectionPage } = useRedirectEventTargetSelectionPage();

  const handlePostClick = () => {
    if (onClickPost) return onClickPost();

    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_post_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <SelectPostTargetPage />,
    });
  };

  const onClickStory = () => {
    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_story_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <StoryTargetSelectionPage />,
    });
  };

  const handlePollClick = () => {
    if (onClickPoll) {
      onClickPoll();
      return;
    }
    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_poll_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <PollTargetSelectionPage />,
    });
  };

  const renderStoryButton = () => {
    const isExcludedPage = pageId === 'user_profile_page';
    const isFileTriggerPage = pageId === 'community_profile_page';

    if (!hasStoryPermission || isExcludedPage || isDisableStory) return null;

    if (isFileTriggerPage) {
      return (
        <FileTrigger onSelect={onSelectFile}>
          <StoryButton
            pageId={pageId}
            componentId={componentId}
            defaultIconClassName={styles.postComposer__button}
          />
        </FileTrigger>
      );
    }

    return (
      <StoryButton
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
        onPress={onClickStory}
      />
    );
  };

  const handleLivestreamClick = () => {
    if (onClickLivestream) return onClickLivestream();
    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_livestream_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <LivestreamTargetSelectionPage />,
    });
  };

  const renderEventButton = () => {
    const isExcludedPage = pageId === 'user_profile_page';
    const isFromCommunityPage = pageId === 'community_profile_page';

    if (!hasCreateEventPermission || isExcludedPage || isDisableEvent) return null;

    return (
      <EventButton
        pageId="post_composer_page"
        onPress={isFromCommunityPage ? onClickEvent : redirectEventTargetSelectionPage}
      />
    );
  };

  return (
    <div className={styles.postComposer} data-testid={accessibilityId} style={themeStyles}>
      <UserAvatar
        pageId={pageId}
        userId={user?.userId}
        componentId={componentId}
        shouldRedirectToUserProfile
        className={styles.postComposer__avatar}
        imageContainerClassName={styles.postComposer__avatar}
        textPlaceholderClassName={styles.postComposer__avatarPlaceholder}
      />
      <Button className={styles.postComposer__input} onPress={handlePostClick}>
        What's going on?
      </Button>
      <ImageButton
        onPress={handlePostClick}
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
      />
      <VideoButton
        onPress={handlePostClick}
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
      />
      <LivestreamButton onPress={handleLivestreamClick} pageId="post_composer_page" />
      <PollButton onPress={handlePollClick} pageId="post_composer_page" componentId="poll_button" />
      {renderEventButton()}
      {renderStoryButton()}
    </div>
  );
}
