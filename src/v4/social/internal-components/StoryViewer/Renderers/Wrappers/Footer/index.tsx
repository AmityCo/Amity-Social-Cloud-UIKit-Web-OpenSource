import React from 'react';

import { DotsIcon, ErrorIcon } from '~/icons';
import { useIntl } from 'react-intl';
import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import Spinner from '~/social/components/Spinner';
import { ImpressionButton, ReactionButton } from '~/v4/social/elements';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommentButton } from '~/v4/social/elements/CommentButton/CommentButton';

import styles from './Footer.module.css';
import clsx from 'clsx';

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
    myReactions: string[];
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
  const { formatMessage } = useIntl();

  const handleClickReaction = async () => {
    try {
      if (!isMember) {
        notification.show({
          content: formatMessage({ id: 'storyViewer.toast.disable.react' }),
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
            <ImpressionButton pageId="story_page" reach={reach} />
          </div>
        )}
      </div>
      <div className={styles.viewStoryCompostBarEngagementContainer}>
        <CommentButton
          className={clsx(styles.viewStoryCommentButton)}
          defaultIconClassName={clsx(styles.viewStoryCommentIcon)}
          pageId="story_page"
          commentsCount={commentsCount}
          onPress={onClickComment}
        />
        <ReactionButton
          onReactionClick={handleClickReaction}
          pageId="story_page"
          myReactions={myReactions}
          reactionsCount={reactionsCount}
        />
      </div>
    </div>
  );
};

export default Footer;
