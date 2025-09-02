import React, { FC, useMemo, useState } from 'react';
import { Typography } from '~/v4/core/components';
import styles from './PollContent.module.css';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { calculateRemainingFromMs } from '~/v4/social/utils/calculateRemainingFromMs';
import { useVotePoll, useUnvotePoll } from '~/v4/social/hooks/usePollVote';
import { PollVotedItem } from './PollVotedItem';
import useUser from '~/core/hooks/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import { PollSingleAnswer } from './PollSingleAnswer';
import { PollMultipleAnswer } from './PollMultipleAnswer';

type PollContentProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  posts: Amity.Post<'poll'>[];
  parentPost: Amity.Post;
  disabled?: boolean;
  onPostDeleted?: (post: Amity.Post) => void;
  expandOption?: boolean;
};

export const PollContent: FC<PollContentProps> = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  parentPost,
  posts,
  disabled = false,
  expandOption = false,
  onPostDeleted,
}) => {
  const { currentUserId } = useSDK();

  const poll = posts?.[0]?.getPollInfo();
  const [answers, setAnswers] = useState<string[] | undefined>();
  const [isAuthorSeeingPoll, setIsAuthorSeeingPoll] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(expandOption);
  const [isPollEnded, setIsPollEnded] = useState<boolean>(poll?.status === 'closed');

  const user = useUser(currentUserId);

  const showAllChoices = pageId === 'post_detail_page' || pageId === 'pending_request_page';
  const maxChoicesShown = 4;
  const isAuthor = parentPost?.creator?.userId === currentUserId;
  const isVoteDisabled = parentPost?.feedType === 'reviewing' || disabled;
  const isVoteButtonDisabled = isVoteDisabled || !answers || answers?.length < 1 || disabled;

  const pollAnswers = useMemo(() => {
    if (!poll) return [];

    const maxVoteCount = Math.max(...poll.answers.map((answer) => answer.voteCount));

    const processPollAnswers = poll.answers
      .map((answer) => ({
        ...answer,
        isTopVoted: answer.voteCount !== 0 && answer.voteCount === maxVoteCount,
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    if (!showAllChoices && processPollAnswers.length > maxChoicesShown && !isExpanded) {
      return processPollAnswers.slice(0, maxChoicesShown);
    }

    return poll.status === 'closed' ? processPollAnswers : poll.answers;
  }, [poll?.answers, isExpanded]) as (Amity.PollAnswer & { isTopVoted: boolean })[];

  const isShowMore = useMemo(
    () => poll?.answers && !showAllChoices && poll?.answers.length > maxChoicesShown,
    [poll?.answers],
  );
  const voteCount = useMemo(
    () => poll?.answers.reduce((acc, answer) => acc + answer.voteCount, 0),
    [poll?.answers],
  );

  const handlePollEnd = () => {
    setIsPollEnded(true);
  };

  const { mutateAsync: mutateVotePoll } = useVotePoll({ onPostDeleted, parentPost });
  const { mutateAsync: mutateUnvotePoll } = useUnvotePoll({
    onPostDeleted,
    onPollEnded: handlePollEnd,
    parentPost,
  });

  const formatPercentage = (count?: number) => {
    if (!count) return '0';
    return Number.isInteger(count) ? String(count) : count.toFixed(2);
  };

  if (posts[0]?.dataType !== 'poll' || !poll) return null;

  return (
    <>
      {poll.isVoted || isAuthorSeeingPoll || isPollEnded ? (
        <>
          <div
            className={styles.pollContent__votedItemsContainer}
            data-image-poll={pollAnswers?.[0].dataType === 'image'}
          >
            {pollAnswers.map((answer) => (
              <PollVotedItem
                label={answer.data}
                percentage={
                  voteCount ? formatPercentage((answer.voteCount / voteCount) * 100) : '0'
                }
                voteCount={answer.voteCount}
                currentUserId={answer.isVotedByUser ? user?.userId : undefined}
                isTopVoted={answer.isTopVoted}
                key={answer.id}
                imageFileId={answer.fileId}
                isOwner={isAuthor}
              />
            ))}
          </div>
          {isShowMore && !isExpanded && (
            <Button
              variant="outlined"
              color="secondary"
              className={styles.pollContent__seeMore__button}
              onPress={() => setIsExpanded(true)}
              isDisabled={disabled}
            >
              See full results
            </Button>
          )}
        </>
      ) : (
        <>
          {poll.answerType === 'single' ? (
            <PollSingleAnswer
              caption="Select one option"
              answers={pollAnswers}
              disabled={isVoteDisabled}
              onAnswerChanged={(ans) => setAnswers([ans])}
              isOwner={isAuthor}
            />
          ) : (
            <PollMultipleAnswer
              caption="Select one or more options"
              answers={pollAnswers}
              disabled={isVoteDisabled}
              onAnswerChanged={setAnswers}
              isOwner={isAuthor}
            />
          )}
          {isShowMore && !isExpanded && (
            <Button
              variant="outlined"
              color="secondary"
              className={styles.pollContent__seeMore__button}
              onPress={() => setIsExpanded(true)}
            >{`See ${poll.answers.length - maxChoicesShown} more option${poll.answers.length - maxChoicesShown > 1 ? 's' : ''}`}</Button>
          )}
          <Button
            className={styles.pollContent__vote__button}
            onPress={() => {
              if (!answers) return;
              mutateVotePoll({ pollId: poll.pollId, answerIds: answers });
            }}
            isDisabled={isVoteButtonDisabled}
          >
            Vote
          </Button>
        </>
      )}
      <div className={styles.pollContent__pollDetail__container}>
        <div className={styles.pollContent__pollDetail}>
          <Typography.CaptionBold>{voteCount}</Typography.CaptionBold>
          <Typography.CaptionBold>
            vote{`${voteCount && voteCount > 1 ? 's' : ''}`}
          </Typography.CaptionBold>
          <Typography.CaptionBold>•</Typography.CaptionBold>
          {!isPollEnded && typeof poll.closedIn === 'number' ? (
            <>
              <Typography.CaptionBold data-testid="poll-closeIn">
                {calculateRemainingFromMs(poll.closedIn)}
              </Typography.CaptionBold>
              <Typography.CaptionBold>left</Typography.CaptionBold>
            </>
          ) : (
            <Typography.CaptionBold>Ended</Typography.CaptionBold>
          )}
        </div>
        {poll.isVoted && !isPollEnded && (
          <Button variant="text" onPress={() => mutateUnvotePoll({ pollId: poll.pollId })}>
            <Typography.CaptionBold>Unvote</Typography.CaptionBold>
          </Button>
        )}
        {isAuthor &&
          !poll.isVoted &&
          !isAuthorSeeingPoll &&
          parentPost.feedType !== 'reviewing' &&
          !isPollEnded && (
            <Button variant="text" onPress={() => setIsAuthorSeeingPoll(true)}>
              <Typography.CaptionBold className={styles.pollContent__pollDetail__seeResult}>
                See results
              </Typography.CaptionBold>
            </Button>
          )}
        {isAuthorSeeingPoll && (
          <Button variant="text" onPress={() => setIsAuthorSeeingPoll(false)}>
            <Typography.CaptionBold className={styles.pollContent__pollDetail__seeResult}>
              Back to poll
            </Typography.CaptionBold>
          </Button>
        )}
      </div>
    </>
  );
};
