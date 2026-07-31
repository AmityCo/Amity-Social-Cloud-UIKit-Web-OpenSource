import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from 'react';
import clsx from 'clsx';
import { TypographyComponentMap, TypographyVariant } from '~/v4/core/components';
import { Button, type ButtonProps } from '~/v4/core/design/components/Button/Button';
import { Skeleton } from '~/v4/core/design/components/Skeleton/Skeleton';
import { ConversationChat } from '~/v4/icons/ConversationChat';
import Copy from '~/v4/icons/Copy';
import { GroupChat } from '~/v4/icons/GroupChat';
import { Pencil } from '~/v4/icons/Pencil';
import Reply from '~/v4/icons/Reply';
import { Save } from '~/v4/icons/Save';
import { TrashIcon } from '~/v4/icons/Trash';
import styles from './Menu.module.css';

export type MenuIconName =
  | 'conversation-chat'
  | 'group-chat'
  | 'pen'
  | 'reply'
  | 'trash'
  | 'copy'
  | 'save';

const ICON_REGISTRY: Record<MenuIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  'conversation-chat': ConversationChat,
  'group-chat': GroupChat,
  pen: Pencil,
  reply: Reply,
  trash: TrashIcon,
  copy: Copy,
  save: Save,
};

export type MenuIcon = MenuIconName | ComponentType<SVGProps<SVGSVGElement>> | ReactNode;

type MenuProps = ComponentPropsWithoutRef<'div'> & {
  container?: 'popover' | 'drawer';
  variant?: 'social' | 'chat';
};

function Menu({
  children,
  container = 'popover',
  variant = 'social',
  className,
  ...rest
}: MenuProps) {
  return (
    <div
      {...rest}
      className={clsx(styles.menu, className)}
      data-container={container}
      data-variant={variant}
    >
      {children}
    </div>
  );
}

type MenuItemProps = {
  label: string;
  icon?: MenuIcon;
  iconClassName?: string;
  destructive?: boolean;
  className?: string;
  onPress: ButtonProps['onPress'];
  typography?: TypographyVariant;
};

function renderIcon(icon: MenuIcon | undefined, className?: string): ReactNode {
  if (icon == null) return null;
  if (typeof icon === 'string') {
    const RegisteredIcon = ICON_REGISTRY[icon as MenuIconName];
    if (!RegisteredIcon) return null;
    return <RegisteredIcon className={className} />;
  }
  if (typeof icon === 'function') {
    const IconComponent = icon as ComponentType<SVGProps<SVGSVGElement>>;
    return <IconComponent className={className} />;
  }
  if (isValidElement(icon)) {
    const element = icon as ReactElement<{ className?: string }>;
    return cloneElement(element, {
      className: clsx(className, element.props.className),
    });
  }
  return null;
}

function MenuItem({
  icon,
  label,
  destructive = false,
  onPress,
  className,
  iconClassName,
  typography = TypographyVariant.BodyBold,
}: MenuItemProps) {
  const iconNode = renderIcon(icon, clsx(styles.menuItem__icon, iconClassName));

  const $Typography = TypographyComponentMap[typography];

  return (
    <Button
      fullWidth
      variant="default"
      onPress={onPress}
      data-destructive={destructive}
      className={clsx(styles.menuItem, className)}
    >
      {iconNode}
      <$Typography className={styles.menuItem__label}>{label}</$Typography>
    </Button>
  );
}

Menu.Item = MenuItem;

type MenuItemSkeletonProps = {
  className?: string;
};

function MenuItemSkeleton({ className }: MenuItemSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-hidden="true"
      data-destructive="false"
      className={clsx(styles.menuItem, styles['menuItem--skeleton'], className)}
    >
      <Skeleton.Line height="0.625rem" width="100%" />
    </div>
  );
}

MenuItem.Skeleton = MenuItemSkeleton;

export { Menu };
