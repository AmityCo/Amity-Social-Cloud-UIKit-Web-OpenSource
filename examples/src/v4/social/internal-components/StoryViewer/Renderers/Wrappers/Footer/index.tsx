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

const Footer: React.FC<
  React.PropsWithChildren<{
    pageId?: string;
    storyId?: string;
    showImpression: boolean;
    reach?: number | null;
    commentsCount: number;
    reactionsCount: number;
    isLiked?: boolean;
    onClickComment: () => void;
    syncState?: Amity.SyncState;
    isMember?: boolean;
    myReactions?: string[];
    onPlay: () => void;
    onPause: () => void;
    onDeleteStory?: () => void;
  }>
> = ({
  pageId = '*',
  syncState,
  reach,
  commentsCount,
  reactionsCount,
  isLiked,
  storyId,
  onClickComment,
  showImpression,
  isMember,
  myReactions,
  onPlay,
  onPause,
  onDeleteStory,
}) => {
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

  const handleClickReaction = async () => {
    try {
      if (!isMember) {
        notification.info({
          content: 'Join community to interact with all stories',
        });
        return;
      }
      if (!isLiked) {
        await ReactionRepository.addReaction('story', storyId as string, LIKE_REACTION_KEY);
      } else {
        await ReactionRepository.removeReaction('story', storyId as string, LIKE_REACTION_KEY);
      }
    } catch (error) {
      console.error("Can't toggle like", error);
    }
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
          onPress={handleClickReaction}
        />
      </div>
    </div>
  );
};

export default Footer;
