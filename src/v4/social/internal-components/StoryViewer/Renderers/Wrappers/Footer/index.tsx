import React from 'react';
import { ReactionRepository, StoryRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/v4/social/constants';
import Spinner from '~/social/components/Spinner';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

import { StoryCommentButton } from '~/v4/social/elements/StoryCommentButton/StoryCommentButton';
import { StoryReactionButton } from '~/v4/social/elements/StoryReactionButton/StoryReactionButton';
import { StoryImpressionButton } from '~/v4/social/elements/StoryImpressionButton/StoryImpressionButton';

import styles from './Footer.module.css';
import { Button } from '~/v4/core/components/AriaButton';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { EllipsisH } from '~/v4/icons/Ellipsis';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

const Footer: React.FC<
  React.PropsWithChildren<{
    pageId?: string;
    storyId?: string;
    community?: Amity.Community;
    showImpression: boolean;
    reach?: number | null;
    commentsCount: number;
    reactionsCount: number;
    isLiked?: boolean;
    onClickComment: () => void;
    syncState?: Amity.SyncState;
    myReactions?: string[];
    onPlay: () => void;
    onPause: () => void;
    onDeleteStory?: () => void;
  }>
> = ({
  pageId = '*',
  syncState,
  community,
  reach,
  commentsCount,
  reactionsCount,
  isLiked,
  storyId,
  onClickComment,
  showImpression,
  myReactions,
  onPlay,
  onPause,
  onDeleteStory,
}) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();
  const notification = useNotifications();
  const { confirm } = useConfirmContext();

  const onClickFailedMenu = () => {
    onPause();
    confirm({
      title: 'Failed to upload story',
      content: 'Would you like to discard uploading?',
      cancelText: 'Cancel',
      okText: 'Discard',
      onCancel() {
        onPlay();
      },
      onOk: () => {
        onDeleteStory?.();
      },
    });
  };

  const onReactionClick = async () => {
    try {
      if (!isLiked) {
        await ReactionRepository.addReaction('story', storyId as string, LIKE_REACTION_KEY);
      } else {
        await ReactionRepository.removeReaction('story', storyId as string, LIKE_REACTION_KEY);
      }
    } catch (error) {
      console.error("Can't toggle like", error);
    }
  };

  const handleReactionClick = () => {
    if (community) {
      handleCommunityProfileBehavior({
        defaultBehavior: () => onReactionClick(),
        allowNonMember: false,
        isJoined: community?.isJoined,
      });
      return;
    }

    handleUserProfileBehavior({
      defaultBehavior: () => onReactionClick(),
      allowNonFollower: true,
    });
  };

  if (syncState === 'syncing') {
    return (
      <div className={styles.viewStoryCompostBarContainer}>
        <div className={styles.viewStoryUploadingWrapper}>
          <Spinner width={20} height={20} />
          Uploading...
        </div>
      </div>
    );
  }

  if (syncState === 'error') {
    return (
      <div className={styles.viewStoryFailedCompostBarContainer}>
        <div className={styles.viewStoryFailedCompostBarWrapper}>
          <ExclamationCircle className={styles.menuButton} />
          <span>Failed to upload</span>
        </div>
        <Button variant="text" onPress={onClickFailedMenu}>
          <EllipsisH className={styles.menuButton} />
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.viewStoryCompostBarContainer}>
      <div>
        {showImpression && (
          <div className={styles.viewStoryCompostBarViewIconContainer}>
            <StoryImpressionButton reach={reach} />
          </div>
        )}
      </div>
      <div className={styles.viewStoryCompostBarEngagementContainer}>
        <StoryCommentButton
          pageId={pageId}
          commentsCount={commentsCount}
          onPress={onClickComment}
        />
        <StoryReactionButton
          pageId={pageId}
          myReactions={myReactions}
          reactionsCount={reactionsCount}
          onPress={handleReactionClick}
        />
      </div>
    </div>
  );
};

export default Footer;
