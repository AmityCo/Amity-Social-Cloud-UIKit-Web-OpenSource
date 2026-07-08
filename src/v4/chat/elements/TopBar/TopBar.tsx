import type { ReactNode } from 'react';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { IconButton } from '~/v4/chat/elements/IconButton';
import styles from './TopBar.module.css';

type TopBarProps = {
  title: string;
  leadingType?: 'back' | 'close';
  onLeading: () => void;
  trailing?: ReactNode;
};

export function TopBar({ title, leadingType = 'back', onLeading, trailing }: TopBarProps) {
  const isBack = leadingType === 'back';

  return (
    <header className={styles.topBar}>
      <div className={styles.topBar__leftAction}>
        <IconButton
          icon={isBack ? 'chevron-left' : 'close'}
          variant="transparent"
          onPress={onLeading}
          aria-label={isBack ? 'Back' : 'Close'}
        />
      </div>
      <Typography.TitleBold className={styles.topBar__title}>{title}</Typography.TitleBold>
      <div className={styles.topBar__rightAction}>{trailing}</div>
    </header>
  );
}
