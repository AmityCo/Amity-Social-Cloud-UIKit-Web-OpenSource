import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ComponentType, Ref, SVGProps } from 'react';
import { Button, type ButtonProps } from '~/v4/core/components/AriaButton/Button';
import { ArchiveBox } from '~/v4/icons/ArchiveBox';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import CloseIcon from '~/v4/icons/Close';
import { EllipsisH, EllipsisV } from '~/v4/icons/Ellipsis';
import { Plus } from '~/v4/icons/Plus';
import { SearchFill } from '~/v4/icons/SearchFill';
import styles from './IconButton.module.css';

export type IconName =
  | 'plus'
  | 'ellipsis'
  | 'ellipsis-v'
  | 'chevron-left'
  | 'close'
  | 'archive'
  | 'search';

export type IconButtonVariant = 'filled' | 'transparent';

const ICONS: Record<IconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  plus: Plus,
  ellipsis: EllipsisH,
  'ellipsis-v': EllipsisV,
  'chevron-left': ChevronLeft,
  close: CloseIcon,
  archive: ArchiveBox,
  search: SearchFill,
};

export type IconButtonProps = Omit<
  ButtonProps,
  'icon' | 'children' | 'variant' | 'color' | 'size' | 'fullWidth'
> & {
  icon: IconName;
  variant?: IconButtonVariant;
  iconClassName?: string;
};

export const IconButton = forwardRef(function IconButton(
  { icon, variant = 'filled', className, iconClassName, ...props }: IconButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  const Icon = ICONS[icon];

  return (
    <Button
      {...props}
      ref={ref}
      variant="default"
      icon={<Icon />}
      data-variant={variant}
      className={clsx(styles.iconButton, className)}
      iconClassName={clsx(styles.iconButton__icon, iconClassName)}
    />
  );
});
