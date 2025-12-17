import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DEBOUNCE_PREVIEW_LINK } from '~/v4/social/constants/post';
import { getLinkPreviewMetadata, PreviewMetadataCacheType } from '~/v4/utils/previewLink';

type UsePreviewLinkReturnType = UseQueryResult<PreviewMetadataCacheType, unknown> & {
  isDebouncing: boolean;
};

export const usePreviewLink = ({ url }: { url: string }): UsePreviewLinkReturnType => {
  const [debouncedUrl, setDebouncedUrl] = useState(url);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedUrl(url);
      setIsDebouncing(false);
    }, DEBOUNCE_PREVIEW_LINK);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [url]);

  const queryResult = useQuery<PreviewMetadataCacheType>({
    queryKey: ['preview-metadata', debouncedUrl],
    queryFn: () => getLinkPreviewMetadata(debouncedUrl),
    retry: false,
    enabled: !!debouncedUrl,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (previously cacheTime)
  });

  return {
    ...queryResult,
    isDebouncing,
  };
};
