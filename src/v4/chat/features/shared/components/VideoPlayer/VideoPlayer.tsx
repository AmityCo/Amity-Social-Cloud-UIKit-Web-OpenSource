import { ModalOverlay, Modal, Dialog, Button as AriaButton } from 'react-aria-components';
import { VideoPlayer as SocialVideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Trash } from '~/v4/core/design/icons/Trash';
import { ArrowDownToBracket } from '~/v4/core/design/icons/ArrowDownToBracket';
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
  const { isDesktop } = useResponsive();
  const canDelete = isOwn && !!onDelete;
  const canSave = !!onSave;

  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={styles.videoPlayer__overlay}
    >
      <Modal className={styles.videoPlayer__modal}>
        <Dialog aria-label="Video player" className={styles.videoPlayer__dialog}>
          <div className={styles.videoPlayer__player}>
            <SocialVideoPlayer
              fileId={fileId}
              displayMode={isDesktop ? 'desktop' : 'mobile'}
              showHeader
              onClose={onClose}
              autoPlay
              playsInline
            />
          </div>

          <div className={styles.videoPlayer__bottomBar}>
            {canDelete ? (
              <AriaButton
                type="button"
                className={styles.videoPlayer__iconButton}
                onPress={onDelete}
                aria-label={resolveString('amity_chat_option_delete')}
              >
                <Trash className={styles.videoPlayer__icon} />
              </AriaButton>
            ) : (
              <span />
            )}

            {canSave ? (
              <AriaButton
                type="button"
                className={styles.videoPlayer__iconButton}
                onPress={onSave}
                aria-label={resolveString('amity_chat_action_save')}
              >
                <ArrowDownToBracket className={styles.videoPlayer__icon} />
              </AriaButton>
            ) : (
              <span />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
