import { PollRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const usePoll = pollId => useLiveObject(() => PollRepository.getPoll(pollId), [pollId]);

export default usePoll;
