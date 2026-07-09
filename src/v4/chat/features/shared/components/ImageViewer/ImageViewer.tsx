import { MediaViewer } from '~/v4/chat/features/shared/components/MediaViewer';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './ImageViewer.module.css';

type ImageViewerProps = {
  src: string;
  onClose: () => void;
  isOwn?: boolean;
  onDelete?: () => void;
  onSave?: () => void;
};

export function ImageViewer({ src, onClose, isOwn = false, onDelete, onSave }: ImageViewerProps) {
  return (
    <MediaViewer
      ariaLabel="Image preview"
      onClose={onClose}
      isOwn={isOwn}
      onDelete={onDelete}
      deleteAriaLabel={resolveString('amity_chat_option_delete')}
      onSave={onSave}
      saveAriaLabel={resolveString('amity_chat_action_save')}
    >
      <img src={src} alt="Message image full size" className={styles.imageViewer__img} />
    </MediaViewer>
  );
}
