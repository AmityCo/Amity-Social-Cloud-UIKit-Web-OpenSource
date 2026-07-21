import type { ReactNode } from 'react';
import { ModalOverlay, Modal, Dialog, Button as AriaButton } from 'react-aria-components';
import { Cross } from '~/v4/core/design/icons/Cross';
import { ArrowDownToBracket } from '~/v4/core/design/icons/ArrowDownToBracket';
import { Trash } from '~/v4/core/design/icons/Trash';
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
            <AriaButton
              type="button"
              className={styles.mediaViewer__closeButton}
              onPress={onClose}
              aria-label="Close"
            >
              <Cross className={styles.mediaViewer__closeIcon} />
            </AriaButton>
          </div>

          <div className={styles.mediaViewer__bottomBar}>
            {canDelete ? (
              <AriaButton
                type="button"
                className={styles.mediaViewer__bottomIconButton}
                onPress={onDelete}
                aria-label={deleteAriaLabel}
              >
                <Trash className={styles.mediaViewer__bottomIcon} />
              </AriaButton>
            ) : (
              <span />
            )}

            {canSave ? (
              <AriaButton
                type="button"
                className={styles.mediaViewer__bottomIconButton}
                onPress={onSave}
                aria-label={saveAriaLabel}
              >
                <ArrowDownToBracket className={styles.mediaViewer__bottomIcon} />
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
