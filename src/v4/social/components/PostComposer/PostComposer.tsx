import React from 'react';
import UserIcon from '~/v4/icons/User';
import useSDK from '~/v4/core/hooks/useSDK';
import { Avatar } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { Title } from '~/v4/social/elements/Title';
import { useImage } from '~/v4/core/hooks/useImage';
import { FileTrigger } from 'react-aria-components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PollButton } from '~/v4/social/elements/PollButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import { StoryButton } from '~/v4/social/elements/StoryButton/StoryButton';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import styles from './PostComposer.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';

type PostComposerProps = {
  pageId?: string;
  communityId?: string;
  onClickPost?: () => void;
  onClickPoll?: () => void;
  onSelectFile?: (files: FileList | null) => void;
};

export function PostComposer({
  pageId = '*',
  communityId,
  onClickPost,
  onClickPoll,
  onSelectFile,
}: PostComposerProps) {
  const componentId = 'post_composer';

  const { currentUserId } = useSDK();
  const { goToUserProfilePage } = useNavigation();
  const { openPopup } = usePopupContext();
  const { user, isLoading } = useUser({ userId: currentUserId });
  const { hasStoryPermission } = useStoryPermission(communityId);
  const avatarUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

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

    if (!hasStoryPermission) return null;

    if (hasStoryPermission && isExcludedPage) return null;

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

  return (
    <div className={styles.postComposer} data-testid={accessibilityId} style={themeStyles}>
      <UserAvatar
        pageId={pageId}
        userId={user?.userId}
        componentId={componentId}
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
      <PollButton onPress={handlePollClick} pageId="post_composer_page" componentId="poll_button" />
      {renderStoryButton()}
    </div>
  );
}
