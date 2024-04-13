import React from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Popover as ReactTinyPopover } from 'react-tiny-popover';

export type ReactPopoverProps = {
  fixed?: boolean;
  isOpen: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof ReactTinyPopover>;

const Popover = ({ isOpen, content, fixed = false, children, ...rest }: ReactPopoverProps) => {
  return (
    <ReactTinyPopover
      containerClassName={clsx(styles.popover, { fixed: false })}
      isOpen={isOpen}
      content={content}
      {...rest}
    >
      {children}
    </ReactTinyPopover>
  );
};

export default Popover;
