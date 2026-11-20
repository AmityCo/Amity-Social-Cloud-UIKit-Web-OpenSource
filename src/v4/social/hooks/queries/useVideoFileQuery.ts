import { FileRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const TRANSCODING_POLL_INTERVAL_MS = 5000;

const PENDING_VIDEO_STATUSES = ['uploading', 'uploaded', 'transcoding'];

type UseVideoFileQueryParam = {
  fileId?: string | null;
  enabled?: boolean;
};

export function useVideoFileQuery({ fileId, enabled = true }: UseVideoFileQueryParam) {
  const {
    error,
    isLoading,
    data: videoFile,
  } = useQuery({
    queryKey: ['asc-uikit', 'VideoFile', fileId],
    queryFn: async () =>
      (await FileRepository.getFile(fileId as string)).data as Amity.File<'video'>,
    initialData: () =>
      fileId
        ? (FileRepository.getFile.locally(fileId)?.data as Amity.File<'video'> | undefined)
        : undefined,
    initialDataUpdatedAt: () =>
      fileId ? FileRepository.getFile.locally(fileId)?.cachedAt : undefined,
    enabled: enabled && !!fileId,
    refetchInterval: (query) =>
      PENDING_VIDEO_STATUSES.includes(query.state.data?.status ?? '')
        ? TRANSCODING_POLL_INTERVAL_MS
        : false,
  });

  return { videoFile, isLoading, error };
}
