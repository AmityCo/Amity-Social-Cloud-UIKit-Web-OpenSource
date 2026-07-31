import { useState } from 'react';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useDeleteMessageQuery, useSaveMediaMessageQuery } from '~/v4/chat/hooks/queries';

type ImageView = {
  url: string;
  message: Amity.Message;
};

export type ImageViewerRenderProps = {
  src: string;
  onClose: () => void;
  isOwn: boolean;
  onDelete: () => void;
  onSave: () => void;
};

export type VideoPlayerRenderProps = {
  message: Amity.Message;
  onClose: () => void;
  isOwn: boolean;
  onDelete: () => void;
  onSave?: () => void;
};

export type UseMediaViewerReturn = {
  openImageViewer: (url: string, message: Amity.Message) => void;
  openVideoPlayer: (message: Amity.Message) => void;
  imageViewerProps: ImageViewerRenderProps | null;
  videoPlayerProps: VideoPlayerRenderProps | null;
};

export function useMediaViewer(): UseMediaViewerReturn {
  const { currentUserId } = useSDK();
  const { requestDelete } = useDeleteMessageQuery();
  const { requestSave } = useSaveMediaMessageQuery();
  const [imageView, setImageView] = useState<ImageView | null>(null);
  const [videoMessage, setVideoMessage] = useState<Amity.Message | null>(null);

  function openImageViewer(url: string, message: Amity.Message) {
    setImageView({ url, message });
  }

  function closeImageViewer() {
    setImageView(null);
  }

  function openVideoPlayer(message: Amity.Message) {
    setVideoMessage(message);
  }

  function closeVideoPlayer() {
    setVideoMessage(null);
  }

  const imageViewerProps: ImageViewerRenderProps | null = imageView
    ? {
        src: imageView.url,
        onClose: closeImageViewer,
        isOwn: imageView.message.creatorId === currentUserId,
        onDelete: () => requestDelete(imageView.message, { afterDelete: closeImageViewer }),
        onSave: () => requestSave(imageView.message),
      }
    : null;

  const videoPlayerProps: VideoPlayerRenderProps | null = videoMessage
    ? {
        message: videoMessage,
        onClose: closeVideoPlayer,
        isOwn: videoMessage.creatorId === currentUserId,
        onDelete: () => requestDelete(videoMessage, { afterDelete: closeVideoPlayer }),
      }
    : null;

  return {
    openImageViewer,
    openVideoPlayer,
    imageViewerProps,
    videoPlayerProps,
  };
}
