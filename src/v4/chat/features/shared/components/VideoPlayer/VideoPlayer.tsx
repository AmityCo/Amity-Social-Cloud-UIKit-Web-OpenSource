import useFile from '~/v4/core/hooks/useFile';
import { MediaViewer } from '~/v4/chat/features/shared/components/MediaViewer';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './VideoPlayer.module.css';

type VideoPlayerProps = {
  message: Amity.Message;
  onClose: () => void;
  isOwn?: boolean;
  onDelete?: () => void;
  onSave?: () => void;
};

export function VideoPlayer({
  message,
  onClose,
  isOwn = false,
  onDelete,
  onSave,
}: VideoPlayerProps) {
  const fileId = (message.data as { fileId?: string } | undefined)?.fileId;
  const video = useFile<'video'>(fileId);
  const src = video?.fileUrl;

  return (
    <MediaViewer
      ariaLabel="Video player"
      onClose={onClose}
      isOwn={isOwn}
      onDelete={onDelete}
      deleteAriaLabel={resolveString('amity_chat_option_delete')}
      onSave={onSave}
      saveAriaLabel={resolveString('amity_chat_action_save')}
    >
      {src ? (
        <video src={src} controls autoPlay playsInline className={styles.videoPlayer__video} />
      ) : null}
    </MediaViewer>
  );
}
