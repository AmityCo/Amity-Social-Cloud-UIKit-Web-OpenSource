import React, { useCallback, useMemo } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import millify from 'millify';
import styles from './PollVotedItem.module.css';
import { ImagePollAnswer } from './ImagePollAnswer';

type PollVotedItemProps = {
  label: string;
  currentUserId?: string;
  voteCount: number;
  isTopVoted?: boolean;
  percentage: string;
  imageFileId?: string;
  isOwner?: boolean;
};

export const PollVotedItem: React.FC<PollVotedItemProps> = ({
  label,
  currentUserId,
  voteCount = 0,
  isTopVoted = false,
  percentage,
  imageFileId,
  isOwner,
}) => {
  const calVoteCount = currentUserId ? voteCount - 1 : voteCount;

  const voteByText = useMemo(() => {
    if (calVoteCount === 0 && currentUserId)
      return resolveString('amity_social_label_voted_by_you');
    if (calVoteCount !== 0) {
      const participantText =
        calVoteCount > 1
          ? resolveString('amity_social_label_voted_by_participants', millify(calVoteCount))
          : resolveString('amity_social_label_voted_by_1_participant');
      return currentUserId
        ? `${participantText} ${resolveString('amity_social_button_poll_answer_result_voted_by_and_you')}`
        : participantText;
    } else return resolveString('amity_social_button_no_votes');
  }, [currentUserId, calVoteCount]);

  const renderVoteByText = useCallback(() => {
    return (
      <div className={styles.pollVotedItem__voteCount}>
        <Typography.Caption className={styles.pollVotedItem__voteCount__text}>
          {voteByText}
        </Typography.Caption>
        {currentUserId && (
          <UserAvatar
            className={styles.pollVotedItem__voteCount__avatar}
            userId={currentUserId}
            textPlaceholderClassName={styles.pollVotedItem__voteCount__textPlaceholder}
          />
        )}
      </div>
    );
  }, [voteByText, currentUserId]);

  if (imageFileId)
    return (
      <ImagePollAnswer
        fileId={imageFileId}
        label={label}
        votedPrecentage={percentage}
        votedCountText={renderVoteByText()}
        isOwner={isOwner}
        isTopVoted={isTopVoted}
        data-testid="poll-image-answer"
      />
    );

  return (
    <div className={styles.pollVotedItem} data-top-voted={isTopVoted}>
      <div className={styles.pollVotedItem__title}>
        <Typography.BodyBold className={styles.pollVotedItem__title}>{label}</Typography.BodyBold>
        <Typography.BodyBold
          className={styles.pollVotedItem__title__percent}
          data-top-voted={isTopVoted}
        >
          {percentage}%
        </Typography.BodyBold>
      </div>
      {renderVoteByText()}
      <div className={styles.pollVoteItem__processBar} data-top-voted={isTopVoted}>
        <div
          className={styles.pollVotedItem__processBar__count}
          style={{
            width: `${percentage}%`,
          }}
          data-top-voted={isTopVoted}
        ></div>
      </div>
    </div>
  );
};
