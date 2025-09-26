import { useEffect, useState } from 'react';
import { getShareableLink, SharableModel } from '~/v4/utils/sharableLink';

interface UseSharableLinkParams {
  model: SharableModel;
  referenceId?: string;
}

interface UseSharableLinkResult {
  link: string | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSharableLink = ({
  model,
  referenceId,
}: UseSharableLinkParams): UseSharableLinkResult => {
  const [link, setLink] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLink = async () => {
    if (!referenceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getShareableLink({
        model,
        referenceId,
      });
      setLink(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get shareable link'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, [referenceId, model]);

  const refetch = () => {
    fetchLink();
  };

  return {
    link,
    isLoading,
    error,
    refetch,
  };
};
