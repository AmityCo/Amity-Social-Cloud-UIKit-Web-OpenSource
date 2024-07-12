import React from 'react';

import { DotsIcon, ErrorIcon } from '~/icons';
import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import Spinner from '~/social/components/Spinner';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

import { StoryCommentButton } from '~/v4/social/elements/StoryCommentButton/StoryCommentButton';
import { StoryReactionButton } from '~/v4/social/elements/StoryReactionButton/StoryReactionButton';
import { StoryImpressionButton } from '~/v4/social/elements/StoryImpressionButton/StoryImpressionButton';

import styles from './Footer.module.css';

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
}) => {
  const notification = useNotifications();

  const handleClickReaction = async () => {
    try {
      if (!isMember) {
        notification.info({
          content: 'Join community to interact with all stories',
        });
        return;
      }
      if (!isLiked) {
        await ReactionRepository.addReaction('story', storyId, LIKE_REACTION_KEY);
      } else {
        await ReactionRepository.removeReaction('story', storyId, LIKE_REACTION_KEY);
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
          <ErrorIcon />
          <span>Failed to upload</span>
        </div>
        <DotsIcon />
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
