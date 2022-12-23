import { useEffect, useState, useCallback } from 'react';

import { useAsyncData } from '~/social/providers/DataFetchingProvider';

export function useNoomUserMetadata(userId: string) {
  const [metadata, setMetadata] = useState({});
  const { getUserMetadata } = useAsyncData();

  const getMetadata = useCallback(
    async (userId: string, callback: (data: Record<string, unknown>) => void) => {
      const response = await getUserMetadata?.(userId);
      callback?.(response?.data ?? {});
    },
    [getUserMetadata],
  );

  useEffect(() => {
    getMetadata(userId, setMetadata);
  }, [userId]);

  return metadata;
}
