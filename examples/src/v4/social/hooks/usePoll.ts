import { PollRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

const usePoll = (pollId: string | undefined) => {
  return useLiveObject({
    fetcher: PollRepository.getPoll,
    params: pollId,
    shouldCall: !!pollId,
  });
};

export default usePoll;
