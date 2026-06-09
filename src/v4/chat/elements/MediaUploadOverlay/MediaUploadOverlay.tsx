import { Button } from '~/v4/core/components/AriaButton/Button';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import Close from '~/v4/icons/Close';
import styles from './MediaUploadOverlay.module.css';

export type MediaUploadOverlayProps = {
  onCancel?: () => void;
  cancelAriaLabel?: string;
};

export function MediaUploadOverlay({
  onCancel,
  cancelAriaLabel = 'Cancel upload',
}: MediaUploadOverlayProps) {
  return (
    <div className={styles.overlay}>
      {onCancel ? (
        <Button
          variant="default"
          aria-label={cancelAriaLabel}
          onPress={onCancel}
          className={styles.cancelButton}
        >
          <Spinner className={styles.spinner} />
          <Close className={styles.cancelIcon} />
        </Button>
      ) : (
        <Spinner className={styles.spinner} />
      )}
    </div>
  );
}
