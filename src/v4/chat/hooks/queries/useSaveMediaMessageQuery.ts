import { FileRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type SaveMediaMessageParams = {
  message: Amity.Message;
};

type SaveMediaMessageResponse = {
  dataType: 'image' | 'video';
};

export type UseSaveMediaMessageQueryReturn = {
  requestSave: (message: Amity.Message) => void;
};

async function resolveDownloadUrl(message: Amity.Message): Promise<string> {
  const data = message.data as { fileId?: string } | undefined;
  const fileId = data?.fileId;
  if (!fileId) {
    throw new Error('Message has no fileId');
  }
  const cached = await FileRepository.getFile(fileId);
  const file = cached.data;
  const fileUrl = file.fileUrl;
  if (message.dataType === 'image') {
    if (!fileUrl) throw new Error('Image file has no fileUrl');
    return FileRepository.fileUrlWithSize(fileUrl, 'large');
  }
  if (message.dataType === 'video') {
    const videoUrl = (file as Amity.File<'video'>).videoUrl;
    const resolved = videoUrl?.original ?? fileUrl;
    if (!resolved) throw new Error('Video file has no playable URL');
    return resolved;
  }
  throw new Error(`Unsupported dataType: ${String(message.dataType)}`);
}

function buildFilename(dataType: 'image' | 'video'): string {
  const stamp = Date.now();
  return dataType === 'image' ? `image_${stamp}.jpg` : `video_${stamp}.mp4`;
}

async function triggerBrowserDownload(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  } catch (err) {
    // Fallback for CORS-restricted CDNs
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) throw err;
  }
}

export function useSaveMediaMessageQuery(): UseSaveMediaMessageQueryReturn {
  const { success, error } = useNotifications('chat');
  const photoSuccessToast = useString('amity_chat_save_photo_success');
  const photoFailedToast = useString('amity_chat_save_photo_failed');
  const videoSuccessToast = useString('amity_chat_save_video_success');
  const videoFailedToast = useString('amity_chat_save_video_failed');

  const { mutate } = useMutation<SaveMediaMessageResponse, Error, SaveMediaMessageParams>({
    mutationFn: async ({ message }) => {
      const dataType = message.dataType;
      if (dataType !== 'image' && dataType !== 'video') {
        throw new Error(`Unsupported dataType: ${String(dataType)}`);
      }
      const url = await resolveDownloadUrl(message);
      const filename = buildFilename(dataType);
      await triggerBrowserDownload(url, filename);
      return { dataType };
    },
    onSuccess: ({ dataType }) => {
      if (dataType === 'image') {
        success({ content: photoSuccessToast });
      } else {
        success({ content: videoSuccessToast });
      }
    },
    onError: (_err, variables) => {
      const dataType = variables.message.dataType;
      if (dataType === 'image') {
        error({ content: photoFailedToast });
      } else if (dataType === 'video') {
        error({ content: videoFailedToast });
      }
    },
  });

  function requestSave(message: Amity.Message) {
    if (message.dataType !== 'image' && message.dataType !== 'video') return;
    mutate({ message });
  }

  return { requestSave };
}
