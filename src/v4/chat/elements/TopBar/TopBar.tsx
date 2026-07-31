import type { ReactNode } from 'react';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Button } from '~/v4/core/design/atoms/Button';
import { ChevronLeft } from '~/v4/core/design/icons/ChevronLeft';
import { Cross } from '~/v4/core/design/icons/Cross';
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
        <Button.Icon
          icon={isBack ? <ChevronLeft /> : <Cross />}
          styleType="ghost"
          hierarchy="secondary"
          size={32}
          onPress={onLeading}
          aria-label={isBack ? 'Back' : 'Close'}
        />
      </div>
      <Typography.TitleBold className={styles.topBar__title}>{title}</Typography.TitleBold>
      <div className={styles.topBar__rightAction}>{trailing}</div>
    </header>
  );
}
