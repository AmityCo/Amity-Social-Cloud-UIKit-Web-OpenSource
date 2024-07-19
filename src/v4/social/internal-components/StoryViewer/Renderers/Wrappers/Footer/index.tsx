import React from 'react';

import { DotsIcon, ErrorIcon } from '~/icons';
import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import Spinner from '~/social/components/Spinner';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

import styles from './Footer.module.css';
import clsx from 'clsx';
import { StoryCommentButton } from '~/v4/social/elements/StoryCommentButton/StoryCommentButton';
import { StoryReactionButton } from '~/v4/social/elements/StoryReactionButton/StoryReactionButton';
import { StoryImpressionButton } from '~/v4/social/elements/StoryImpressionButton/StoryImpressionButton';

const Footer: React.FC<
  React.PropsWithChildren<{
    storyId: string;
    showImpression: boolean;
    reach: number | null;
    commentsCount: number;
    reactionsCount: number;
    isLiked: boolean;
    onClickComment: () => void;
    syncState?: Amity.SyncState;
    isMember?: boolean;
    myReactions?: string[];
  }>
> = ({
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
        notification.show({
          content: 'You need to be a member to like this story',
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
        <StoryCommentButton commentsCount={commentsCount} onPress={onClickComment} />
        <StoryReactionButton
          myReactions={myReactions}
          reactionsCount={reactionsCount}
          onPress={handleClickReaction}
        />
      </div>
    </div>
  );
};

export default Footer;
