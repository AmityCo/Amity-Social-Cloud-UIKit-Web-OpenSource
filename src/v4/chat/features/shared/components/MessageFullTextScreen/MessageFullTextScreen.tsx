import { useEffect } from 'react';
import Linkify from 'linkify-react';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Button } from '~/v4/core/design/atoms/Button';
import { ChevronLeft } from '~/v4/core/design/icons/ChevronLeft';
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
        <Button.Icon
          icon={<ChevronLeft />}
          styleType="ghost"
          hierarchy="secondary"
          size={32}
          onPress={onClose}
          aria-label="Back"
        />
        <Typography.TitleBold className={styles.fullTextScreen__title}>
          {title}
        </Typography.TitleBold>
        <span className={styles.fullTextScreen__headerSpacer} aria-hidden="true" />
      </div>
      <div className={styles.fullTextScreen__body}>
        <p className={styles.fullTextScreen__text}>
          <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' }}>{text}</Linkify>
        </p>
      </div>
    </div>
  );
}
