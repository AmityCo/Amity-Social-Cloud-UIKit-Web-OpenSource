import { Loader } from '~/v4/core/design/atoms/Loader';
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
      <Loader.Upload size="medium" onCancel={onCancel} aria-label={cancelAriaLabel} />
    </div>
  );
}
