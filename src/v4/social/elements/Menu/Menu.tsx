import { ComponentPropsWithoutRef } from 'react';
import { Typography } from '~/v4/core/components';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './Menu.module.css';

type MenuProps = ComponentPropsWithoutRef<'div'> & {
  container?: 'popover' | 'drawer';
};

function Menu({ children, container = 'popover' }: MenuProps) {
  return (
    <div className={styles.menu} data-container={container}>
      {children}
    </div>
  );
}

type MenuItemProps = {
  label: string;
  danger?: boolean;
  onPress: ButtonProps['onPress'];
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function MenuItem({ Icon, label, danger = false, onPress }: MenuItemProps) {
  return (
    <Button
      fullWidth
      variant="default"
      onPress={onPress}
      data-danger={danger}
      className={styles.menuItem}
    >
      <Icon className={styles.menuItem__icon} />
      <Typography.BodyBold className={styles.menuItem__label}>{label}</Typography.BodyBold>
    </Button>
  );
}

Menu.Item = MenuItem;

export { Menu };
