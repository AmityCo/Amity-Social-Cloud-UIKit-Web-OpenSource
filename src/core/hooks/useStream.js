import { StreamRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useStream = streamId => {
  return useLiveObject(() => StreamRepository.getStream(streamId), [streamId]);
};

export default useStream;
