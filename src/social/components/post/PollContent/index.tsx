import React, { ReactEventHandler, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PollRepository } from '@amityco/ts-sdk';

import {
  VoteItemContainer,
  ResultItemContainer,
  Title,
  PollInformation,
  SubmitButton,
  Text,
  ChipContainer,
  VoteCounter,
  ProgressBarContainer,
  ProgressBar,
} from './styles';

import { Chip } from '~/core/components/Radio/styles';
import usePoll from '~/social/hooks/usePoll';

const MILLISECONDS_IN_DAY = 86400000;

interface VoteItemProps {
  data: string;
  onCheck: () => void;
  checked: boolean;
}

const VoteItem = ({ data, onCheck, checked }: VoteItemProps) => {
  return (
    <VoteItemContainer checked={checked} onClick={onCheck}>
      <ChipContainer>
        <Chip checked={checked} />
        <Text>{data}</Text>
      </ChipContainer>
    </VoteItemContainer>
  );
};

interface ResultItemProps {
  data: string;
  voteCount: number;
  totalVotes?: number;
  isVotedByUser: boolean;
}

const ResultItem = ({ data, voteCount, totalVotes = 0, isVotedByUser }: ResultItemProps) => {
  const percentage = voteCount && totalVotes ? (voteCount / totalVotes) * 100 : 0;

  return (
    <ResultItemContainer checked={isVotedByUser}>
      <Text>{data}</Text>
      <ProgressBarContainer>
        <ProgressBar percentage={percentage} checked={isVotedByUser} />
      </ProgressBarContainer>
      <div>
        <FormattedMessage id="poll.votes" values={{ voteCount }} />
      </div>
    </ResultItemContainer>
  );
};

interface Answer {
  id: string;
  data: string;
  voteCount: number;
}

interface VoteListProps {
  answers: Answer[];
  handleCheck: (answerId: string) => void;
  answerIds: string[];
}

const VoteList = ({ answers, handleCheck, answerIds }: VoteListProps) => {
  return (
    <>
      {answers.map(({ id, data, ...answer }) => (
        <VoteItem
          key={id}
          checked={answerIds.includes(id)}
          onCheck={() => handleCheck(id)}
          data={data}
          {...answer}
        />
      ))}
    </>
  );
};

interface ResultListProps {
  answers: Answer[];
  totalVotes?: number;
}

const ResultList = ({ answers, totalVotes }: ResultListProps) => {
  return (
    <>
      {answers.map(({ id, data, ...answer }) => (
        <ResultItem
          key={id}
          data={data}
          {...answer}
          totalVotes={totalVotes}
          isVotedByUser={false}
        />
      ))}
    </>
  );
};

const PollContent = ({ pollId }: { pollId?: string }) => {
  const poll = usePoll(pollId);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const { formatMessage } = useIntl();

  if (poll == null) return null;

  const { answers = [], answerType, closedIn, isDeleted, isVoted, status } = poll;

  const isClosed = status === 'closed';
  const totalVotes = answers.reduce((sum, answer) => sum + answer.voteCount, 0);
  const canSelectMultiple = answerType === 'multiple';

  const handleCheck = (answerId: string) => {
    if (answerIds.includes(answerId)) {
      const index = answerIds.findIndex((id) => id === answerId);
      setAnswerIds((prevAnswerIds) => [
        ...prevAnswerIds.splice(0, index),
        ...prevAnswerIds.splice(index + 1),
      ]);
    } else if (canSelectMultiple) {
      setAnswerIds((prevAnswerIds) => [...prevAnswerIds, answerId]);
    } else {
      setAnswerIds([answerId]);
    }
  };

  const handleSubmit: React.MouseEventHandler<HTMLAnchorElement> = async (e) => {
    if (!pollId) return;
    e.preventDefault();

    if (isClosed || isDeleted) {
      throw new Error(formatMessage({ id: 'poll.error.deletedOrClosed' }));
    }

    await PollRepository.votePoll(pollId, answerIds);
  };

  const closedInDays = Math.floor((closedIn || 0) / MILLISECONDS_IN_DAY);

  return (
    <>
      <PollInformation>
        <Title>
          {!isClosed ? (
            <FormattedMessage id="poll.vote.closedIn" values={{ closedIn: closedInDays }} />
          ) : (
            <FormattedMessage id="poll.vote.finalResults" />
          )}
        </Title>
        <VoteCounter>
          <FormattedMessage id="poll.votes" values={{ voteCount: totalVotes }} />
        </VoteCounter>
      </PollInformation>
      {!isClosed ? (
        !isVoted ? (
          <VoteList answers={answers} handleCheck={handleCheck} answerIds={answerIds} />
        ) : (
          <ResultList answers={answers} totalVotes={totalVotes} />
        )
      ) : (
        <ResultList answers={answers} />
      )}
      {!isVoted && (
        <SubmitButton disabled={!answerIds.length} onClick={handleSubmit}>
          <FormattedMessage id="poll.vote.submit" />
        </SubmitButton>
      )}
    </>
  );
};

export default PollContent;
