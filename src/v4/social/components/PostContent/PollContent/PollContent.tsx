import React, { FC, useMemo, useState } from 'react';
import usePost from '~/v4/core/hooks/objects/usePost';
import usePoll from '~/v4/social/hooks/usePoll';
import { Typography } from '~/v4/core/components';
import styles from './PollContent.module.css';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { calculateRemainingFromMs } from '~/v4/social/utils/calculateRemainingFromMs';
import { useMutation } from '@tanstack/react-query';
import { PollRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { PollVotedItem } from './PollVotedItem';
import useUser from '~/core/hooks/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import { PollSingleAnswer } from './PollSingleAnswer';
import { PollMultipleAnswer } from './PollMultipleAnswer';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type PollContentProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post;
  disabled?: boolean;
};

export const PollContent: FC<PollContentProps> = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  disabled = false,
}) => {
  const { error } = useNotifications();
  const { post: childPost } = usePost(post.children?.[0]);
  const { currentUserId } = useSDK();

  const [answers, setAnswers] = useState<string[] | undefined>();
  const [isAuthorSeeingPoll, setIsAuthorSeeingPoll] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const user = useUser(currentUserId);
  const { item: poll } = usePoll((childPost?.data as Amity.ContentDataPoll)?.pollId);

  const showAllChoices = pageId === 'post_detail_page';
  const maxChoicesShown = 4;
  const isAuthor = post?.creator?.userId === currentUserId;
  const isVoteDisabled = post.feedType === 'reviewing' || disabled;
  const isVoteButtonDisabled = isVoteDisabled || !answers || answers?.length < 1 || disabled;
  const isPollEneded = poll?.status === 'closed';

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

    return poll.isVoted ? processPollAnswers : poll.answers;
  }, [poll?.answers, isExpanded]) as (Amity.PollAnswer & { isTopVoted: boolean })[];

  const isShowMore = useMemo(
    () => poll?.answers && !showAllChoices && poll?.answers.length > maxChoicesShown,
    [poll?.answers],
  );
  const voteCount = useMemo(
    () => poll?.answers.reduce((acc, answer) => acc + answer.voteCount, 0),
    [poll?.answers],
  );

  const { mutateAsync: mutateVotePoll } = useMutation({
    mutationFn: async ({ pollId, answerIds }: { pollId: string; answerIds: string[] }) => {
      return PollRepository.votePoll(pollId, answerIds);
    },
    onError: () => {
      error({ content: 'Oops, something went wrong.' });
    },
  });

  const formatPercentage = (count?: number) => {
    if (!count) return '0';
    return Number.isInteger(count) ? String(count) : count.toFixed(2);
  };

  if (childPost?.dataType !== 'poll' || !poll) return null;

  return (
    <>
      {poll.isVoted || isAuthorSeeingPoll || isPollEneded ? (
        <>
          <div className={styles.pollContent__votedItemsContainer}>
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
            />
          ) : (
            <PollMultipleAnswer
              caption="Select one or more options"
              answers={pollAnswers}
              disabled={isVoteDisabled}
              onAnswerChanged={setAnswers}
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
          {!isPollEneded && typeof poll.closedIn === 'number' ? (
            <>
              <Typography.CaptionBold>
                {calculateRemainingFromMs(poll.closedIn)}
              </Typography.CaptionBold>
              <Typography.CaptionBold>left</Typography.CaptionBold>
            </>
          ) : (
            <Typography.CaptionBold>Ended</Typography.CaptionBold>
          )}
        </div>
        {isAuthor &&
          !poll.isVoted &&
          !isAuthorSeeingPoll &&
          post.feedType !== 'reviewing' &&
          !isPollEneded && (
            <Button variant="text" onPress={() => setIsAuthorSeeingPoll(true)}>
              <Typography.CaptionBold className={styles.pollContent__pollDetail__seeResult}>
                See results
              </Typography.CaptionBold>
            </Button>
          )}
        {isAuthorSeeingPoll && (
          <Button variant="text" onPress={() => setIsAuthorSeeingPoll(false)}>
            <Typography.CaptionBold className={styles.pollContent__pollDetail__seeResult}>
              Back to vote
            </Typography.CaptionBold>
          </Button>
        )}
      </div>
    </>
  );
};
