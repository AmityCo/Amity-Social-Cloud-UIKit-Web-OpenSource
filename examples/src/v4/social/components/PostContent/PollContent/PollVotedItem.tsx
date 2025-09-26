import React, { useCallback } from 'react';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import millify from 'millify';
import styles from './PollVotedItem.module.css';

type PollVotedItemProps = {
  label: string;
  currentUserId?: string;
  voteCount: number;
  isTopVoted?: boolean;
  percentage: string;
};

export const PollVotedItem: React.FC<PollVotedItemProps> = ({
  label,
  currentUserId,
  voteCount = 0,
  isTopVoted = false,
  percentage,
}) => {
  const calVoteCount = currentUserId ? voteCount - 1 : voteCount;
  const voteByText = useCallback(() => {
    if (calVoteCount === 0 && currentUserId) return 'Voted by you';
    if (calVoteCount !== 0)
      return `Voted by ${millify(calVoteCount)} participant${calVoteCount > 1 ? 's' : ''}${currentUserId ? ' and you' : ''}`;
    else return 'No votes';
  }, [currentUserId, calVoteCount]);
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
      <div className={styles.pollVotedItem__voteCount}>
        <Typography.Caption>{voteByText()}</Typography.Caption>
        {currentUserId && (
          <UserAvatar
            className={styles.pollVotedItem__voteCount__avatar}
            userId={currentUserId}
            textPlaceholderClassName={styles.pollVotedItem__voteCount__textPlaceholder}
          />
        )}
      </div>
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
