import { PollRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const usePoll = (pollId) => {
  const poll = useLiveObject(() => PollRepository.getPoll(pollId), [pollId]);
  const handleClosePoll = () => PollRepository.closePoll(pollId);

  return {
    poll,
    handleClosePoll,
  };
};

export default usePoll;
