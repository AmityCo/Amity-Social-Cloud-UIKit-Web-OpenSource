import React from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { Button } from '~/v4/core/natives/Button';
import { Title } from '~/v4/social/elements/Title';
import { useImage } from '~/v4/core/hooks/useImage';
import { FileTrigger } from 'react-aria-components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PollButton } from '~/v4/social/elements/PollButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { FileButton } from '~/v4/social/elements/FileButton';
import { Icon } from '~/v4/core/components/Icon/Icon';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import { StoryButton } from '~/v4/social/elements/StoryButton/StoryButton';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import styles from './PostComposer.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type PostComposerProps = {
  pageId?: string;
  communityId?: string;
  onClickPost?: () => void;
  onClickPoll?: () => void;
  onSelectFile?: (files: FileList | null) => void;
  onSelectedFeed?: (feed: string) => void;
  onSearchClick?: () => void;
};
type FeedType = 'all' | 'poker' | 'scommesse' | 'bingo';

export function PostComposer({
  pageId = '*',
  communityId,
  onClickPost,
  onClickPoll,
  onSelectFile,
  onSelectedFeed,
  onSearchClick,
}: PostComposerProps) {
  const componentId = 'post_composer';

  const { currentUserId } = useSDK();
  const { goToUserProfilePage } = useNavigation();
  const { openPopup } = usePopupContext();
  const { user, isLoading } = useUser({ userId: currentUserId });
  const { hasStoryPermission } = useStoryPermission(communityId);
  const avatarUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [activeFeed, setActiveFeedId] = React.useState<FeedType>('all'); // Default su 'all'
  const { isDesktop } = useResponsive();

  // const handlePostClick = () => {
  //   if (onClickPost) return onClickPost();

  //   openPopup({
  //     pageId,
  //     componentId,
  //     view: 'desktop',
  //     header: (
  //       <Title pageId="select_post_target_page" titleClassName={styles.postComposer__title} />
  //     ),
  //     children: <SelectPostTargetPage />,
  //   });
  // };

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
  const setActiveFeedFunc = (feed: FeedType) => {
    setActiveFeedId(feed);
    if (onSelectedFeed) {
      onSelectedFeed(feed);
    }
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
    <div className={styles.containerFeedChooser}>
      {isDesktop && <Typography.Headline as="h1">Community</Typography.Headline>}
      <div className={styles.postComposer} data-testid={accessibilityId} style={themeStyles}>
        <Button className={styles.postComposer__button} onPress={onSearchClick}>
          <Icon name="Search" />
        </Button>
        <Button
          className={`${activeFeed === 'all' ? styles.postComposer__tagButton_active : styles.postComposer__tagButton}`}
          onPress={() => setActiveFeedFunc('all')}
        >
          Tutti
        </Button>
        <Button
          className={`${activeFeed === 'poker' ? styles.postComposer__tagButton_active : styles.postComposer__tagButton}`}
          onPress={() => setActiveFeedFunc('poker')}
        >
          Poker
        </Button>
        <Button
          className={`${activeFeed === 'scommesse' ? styles.postComposer__tagButton_active : styles.postComposer__tagButton}`}
          onPress={() => setActiveFeedFunc('scommesse')}
        >
          Scommesse
        </Button>
        <Button
          className={`${activeFeed === 'bingo' ? styles.postComposer__tagButton_active : styles.postComposer__tagButton}`}
          onPress={() => setActiveFeedFunc('bingo')}
        >
          Bingo
        </Button>
      </div>

    </div>
  );
}
