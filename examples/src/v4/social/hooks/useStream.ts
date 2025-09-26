import { StreamRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useStream = (streamId?: string) => {
  const [stream, setStream] = useState<Amity.Stream | null>(null);

  useEffect(() => {
    if (streamId == null) return;

    const unsubscribe = StreamRepository.getStreamById(streamId, ({ data }) => {
      setStream(data);
    });

    return () => {
      unsubscribe();
    };
  }, [streamId]);

  return stream;
};

export default useStream;
