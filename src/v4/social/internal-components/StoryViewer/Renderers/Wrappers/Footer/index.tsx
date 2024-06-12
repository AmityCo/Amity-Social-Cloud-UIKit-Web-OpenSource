import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';

import { DotsIcon, ErrorIcon } from '~/icons';
import { useIntl } from 'react-intl';
import millify from 'millify';
import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import Spinner from '~/social/components/Spinner';
import { StoryCommentButton, ImpressionButton, ReactButton } from '~/v4/social/elements';

const Footer: React.FC<
  React.PropsWithChildren<{
    storyId: string;
    showImpression: boolean;
    reach: number | null;
    commentsCount: number;
    totalLikes: number;
    isLiked: boolean;
    onClickComment: () => void;
    syncState?: Amity.SyncState;
  }>
> = ({
  syncState,
  reach,
  commentsCount,
  totalLikes,
  isLiked,
  storyId,
  onClickComment,
  showImpression,
}) => {
  const { formatMessage } = useIntl();

  const handleLike = async () => {
    try {
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
          {formatMessage({ id: 'storyViewer.footer.uploading' })}
        </div>
      </div>
    );
  }

  if (syncState === 'error') {
    return (
      <div className={styles.viewStoryFailedCompostBarContainer}>
        <div className={styles.viewStoryFailedCompostBarWrapper}>
          <ErrorIcon />
          {formatMessage({ id: 'storyViewer.footer.failed' })}
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
            <ImpressionButton pageId="story_page" componentId="*" />
            {millify(reach || 0)}
          </div>
        )}
      </div>
      <div className={styles.viewStoryCompostBarEngagementContainer}>
        <StoryCommentButton onClick={onClickComment} pageId="story_page" componentId="*">
          {millify(commentsCount) || 0}
        </StoryCommentButton>
        <ReactButton onClick={handleLike} pageId="story_page" isLiked={isLiked}>
          {millify(totalLikes || 0)}
        </ReactButton>
      </div>
    </div>
  );
};

export default Footer;
