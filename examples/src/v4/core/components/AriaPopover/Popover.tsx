import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { MenuButton, MenuButtonProps } from '~/v4/social/elements/MenuButton';
import { Dialog, PopoverProps as $PopoverProps, Popover as $Popover } from 'react-aria-components';
import styles from './Popover.module.css';

type PopoverProps = Omit<$PopoverProps, 'children' | 'trigger'> & {
  containerClassName?: string;
  children: React.ReactNode | (({ closePopover }: { closePopover: () => void }) => React.ReactNode);
  trigger:
    | (Omit<MenuButtonProps, 'onClick'> & {
        onClick?: ({ closePopover }: { closePopover: () => void }) => void;
      })
    | (({
        isOpen,
        isDesktop,
        openPopover,
        closePopover,
      }: {
        isOpen: boolean;
        isDesktop: boolean;
        openPopover: () => void;
        closePopover: () => void;
      }) => React.ReactNode);
};

export const Popover = ({
  trigger,
  children,
  className,
  containerClassName,
  placement = 'bottom right',
  ...props
}: PopoverProps) => {
  const { isDesktop } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const openPopover = () => setIsOpen(true);
  const closePopover = () => setIsOpen(false);

  return (
    <div ref={popoverRef} className={containerClassName}>
      {typeof trigger === 'function' ? (
        trigger({ isOpen, isDesktop, openPopover, closePopover })
      ) : (
        <MenuButton
          {...trigger}
          aria-label="menu"
          aria-expanded={isOpen}
          onClick={() => (isDesktop ? openPopover() : trigger.onClick?.({ closePopover }))}
          className={clsx(isOpen && styles.popover__menuButton, trigger.className)}
        />
      )}
      {isDesktop && (
        <$Popover
          {...props}
          isOpen={isOpen}
          placement={placement}
          triggerRef={popoverRef}
          onOpenChange={setIsOpen}
          className={clsx(styles.popover, className)}
        >
          <Dialog className={styles.dialog} aria-label="popover-dialog">
            {typeof children === 'function' ? children({ closePopover }) : children}
          </Dialog>
        </$Popover>
      )}
    </div>
  );
};
