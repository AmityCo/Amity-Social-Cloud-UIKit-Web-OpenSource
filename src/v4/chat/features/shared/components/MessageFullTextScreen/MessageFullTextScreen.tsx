import { useEffect } from 'react';
import Linkify from 'linkify-react';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import styles from './MessageFullTextScreen.module.css';

type MessageFullTextScreenProps = {
  text: string;
  title?: string;
  onClose: () => void;
};

export function MessageFullTextScreen({ text, title, onClose }: MessageFullTextScreenProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.fullTextScreen}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Full message text'}
    >
      <div className={styles.fullTextScreen__header}>
        <button
          type="button"
          className={styles.fullTextScreen__backButton}
          aria-label="Back"
          onClick={onClose}
        >
          <ChevronLeft className={styles.fullTextScreen__backIcon} />
        </button>
        {title ? <div className={styles.fullTextScreen__title}>{title}</div> : null}
      </div>
      <div className={styles.fullTextScreen__body}>
        <p className={styles.fullTextScreen__text}>
          <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' }}>{text}</Linkify>
        </p>
      </div>
    </div>
  );
}
