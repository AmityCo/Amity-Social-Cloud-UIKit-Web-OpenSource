import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { PollStatus, PollAnswerType, PollRepository } from '@amityco/js-sdk';

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
import ConditionalRender from '~/core/components/ConditionalRender';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import usePoll from '~/social/hooks/usePoll';

const MILLISECONDS_IN_DAY = 86400000;

const VoteItem = ({ data: text, onCheck, checked }) => {
  return (
    <VoteItemContainer checked={checked} onClick={onCheck}>
      <ChipContainer>
        <Chip checked={checked} />
        <Text>{text}</Text>
      </ChipContainer>
    </VoteItemContainer>
  );
};

const ResultItem = ({ data: text, voteCount, totalVotes = 0, isVotedByUser }) => {
  const percentage = voteCount && totalVotes ? (voteCount / totalVotes) * 100 : 0;

  return (
    <ResultItemContainer checked={isVotedByUser}>
      <Text>{text}</Text>
      <ProgressBarContainer>
        <ProgressBar percentage={percentage} checked={isVotedByUser} />
      </ProgressBarContainer>
      <div>
        <FormattedMessage id="poll.votes" values={{ voteCount }} />
      </div>
    </ResultItemContainer>
  );
};

const VoteList = ({ answers, handleCheck, answerIds }) => {
  return answers.map(({ id, ...answer }) => (
    <VoteItem
      key={id}
      checked={answerIds.includes(id)}
      onCheck={() => handleCheck(id)}
      {...answer}
    />
  ));
};

const ResultList = ({ answers, totalVotes }) => {
  return answers.map(({ id, ...answer }) => (
    <ResultItem key={id} {...answer} totalVotes={totalVotes} />
  ));
};

const PollContent = ({ items }) => {
  const { pollId } = items[0]?.data;
  const { poll } = usePoll(pollId);
  const { answers = [], answerType, closedIn, isDeleted, isVoted, status } = poll;

  const isClosed = status === PollStatus.Closed;
  const totalVotes = answers.reduce((sum, answer) => sum + answer.voteCount, 0);
  const canSelectMultiple = answerType === PollAnswerType.Multiple;

  const [answerIds, setAnswerIds] = useState([]);

  const { formatMessage } = useIntl();

  const handleCheck = answerId => {
    if (answerIds.includes(answerId)) {
      const index = answerIds.findIndex(id => id === answerId);
      setAnswerIds(prevAnswerIds => [
        ...prevAnswerIds.splice(0, index),
        ...prevAnswerIds.splice(index + 1),
      ]);
    } else if (canSelectMultiple) {
      setAnswerIds(prevAnswerIds => [...prevAnswerIds, answerId]);
    } else {
      setAnswerIds([answerId]);
    }
  };

  const [handleSubmit] = useAsyncCallback(
    async e => {
      e.preventDefault();

      if (isClosed || isDeleted) {
        throw new Error(formatMessage({ id: 'poll.error.deletedOrClosed' }));
      }

      await PollRepository.votePoll(pollId, answerIds);
    },
    [answerIds, pollId],
  );

  const closedInDays = Math.floor(closedIn / MILLISECONDS_IN_DAY);

  return (
    <div>
      <PollInformation>
        <ConditionalRender condition={!isClosed}>
          <Title>
            <FormattedMessage id="poll.vote.closedIn" values={{ closedIn: closedInDays }} />
          </Title>
          <Title>
            <FormattedMessage id="poll.vote.finalResults" />
          </Title>
        </ConditionalRender>
        <VoteCounter>
          <FormattedMessage id="poll.votes" values={{ voteCount: totalVotes }} />
        </VoteCounter>
      </PollInformation>
      <ConditionalRender condition={!isClosed}>
        <ConditionalRender condition={!isVoted}>
          <VoteList answers={answers} handleCheck={handleCheck} answerIds={answerIds} />
          <ResultList answers={answers} totalVotes={totalVotes} />
        </ConditionalRender>
        <ResultList answers={answers} />
      </ConditionalRender>
      {!isVoted && (
        <SubmitButton onClick={handleSubmit} disabled={!answerIds.length}>
          <FormattedMessage id="poll.vote.submit" />
        </SubmitButton>
      )}
    </div>
  );
};

PollContent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PollContent;
