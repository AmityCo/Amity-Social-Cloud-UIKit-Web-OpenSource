import type { ReactNode } from 'react';
import { ModalOverlay, Modal, Dialog } from 'react-aria-components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import Close from '~/v4/icons/Close';
import { Save } from '~/v4/icons/Save';
import { TrashIcon } from '~/v4/icons/Trash';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './MediaViewer.module.css';

type MediaViewerProps = {
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
  isOwn?: boolean;
  onDelete?: () => void;
  deleteAriaLabel?: string;
  onSave?: () => void;
  saveAriaLabel?: string;
};

export function MediaViewer({
  ariaLabel,
  onClose,
  children,
  isOwn = false,
  onDelete,
  deleteAriaLabel = resolveString('amity_chat_option_delete'),
  onSave,
  saveAriaLabel = resolveString('amity_chat_action_save'),
}: MediaViewerProps) {
  const canDelete = isOwn && !!onDelete;
  const canSave = !!onSave;

  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={styles.mediaViewer__overlay}
    >
      <Modal className={styles.mediaViewer__modal}>
        <Dialog aria-label={ariaLabel} className={styles.mediaViewer__dialog}>
          <div className={styles.mediaViewer__stage}>{children}</div>

          <div className={styles.mediaViewer__topBar}>
            <Button
              type="button"
              variant="default"
              className={styles.mediaViewer__closeButton}
              onPress={onClose}
              aria-label="Close"
            >
              <Close className={styles.mediaViewer__closeIcon} />
            </Button>
          </div>

          <div className={styles.mediaViewer__bottomBar}>
            {canDelete ? (
              <Button
                type="button"
                variant="default"
                className={styles.mediaViewer__bottomIconButton}
                onPress={onDelete}
                aria-label={deleteAriaLabel}
              >
                <TrashIcon className={styles.mediaViewer__bottomIcon} />
              </Button>
            ) : (
              <span />
            )}

            {canSave ? (
              <Button
                type="button"
                variant="text"
                className={styles.mediaViewer__bottomIconButton}
                onPress={onSave}
                aria-label={saveAriaLabel}
              >
                <Save className={styles.mediaViewer__bottomIcon} />
              </Button>
            ) : (
              <span />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
