import { StreamRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useStream = (streamId?: string) => {
  const [stream, setStream] = useState<Amity.Stream | null>(null);

  useEffect(() => {
    async function run() {
      if (streamId == null) return;
      const response = await StreamRepository.getStream(streamId);
      setStream(response.data);
    }
    run();
  }, [streamId]);

  return stream;
};

export default useStream;
