import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchPreviewMetadata,
  isCacheValid,
  previewMetadataCache,
  PreviewMetadataCacheType,
} from '~/v4/utils/previewLink';

type UsePreviewLinkReturnType = UseQueryResult<PreviewMetadataCacheType, unknown>;

export const usePreviewLink = ({ url }: { url: string }): UsePreviewLinkReturnType => {
  return useQuery<PreviewMetadataCacheType>({
    queryKey: ['preview-metadata', url],
    queryFn: async () => {
      // Check cache first
      const cached = previewMetadataCache.get(url);

      if (cached && isCacheValid(cached)) {
        return cached;
      }

      // Fetch new metadata
      const metadata = await fetchPreviewMetadata(url);
      previewMetadataCache.set(url, metadata);
      return metadata;
    },
    retry: false,
    enabled: !!url,
  });
};
