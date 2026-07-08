import { AmitySharableContentType } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';
import { getShareableLinkConfiguration } from '~/v4/utils/sharableLink';

interface UseSharableLinkParams {
  model: AmitySharableContentType;
  referenceId?: string;
}

interface UseSharableLinkResult {
  link: string | undefined;
  isEnabled: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useSharableLink = ({
  model,
  referenceId,
}: UseSharableLinkParams): UseSharableLinkResult => {
  const [link, setLink] = useState<string>();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLink = async () => {
    if (!referenceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = await getShareableLinkConfiguration();
      setIsEnabled(config.isEnabled(model));
      const result = config.generateLink(model, referenceId) ?? undefined;
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
    isEnabled,
    isLoading,
    error,
    refetch,
  };
};
