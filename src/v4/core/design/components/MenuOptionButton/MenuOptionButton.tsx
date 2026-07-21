import React, { FC } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/design/components/Button/Button';
import styles from './MenuOptionButton.module.css';

export interface MenuOptionButtonProps {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
  isDanger?: boolean;
}

// TODO: refactor menu inside social/elements/Menu
export const MenuOptionButton: FC<MenuOptionButtonProps> = ({ text, icon, onPress, isDanger }) => {
  return (
    <Button
      variant="text"
      className={styles.menuOptionButton}
      icon={icon}
      iconClassName={isDanger ? styles.menuOptionButton__dangerIcon : styles.menuOptionButton__icon}
      onPress={onPress}
    >
      <Typography.BodyBold
        className={isDanger ? styles.menuOptionButton__dangerText : styles.menuOptionButton__text}
      >
        {text}
      </Typography.BodyBold>
    </Button>
  );
};
