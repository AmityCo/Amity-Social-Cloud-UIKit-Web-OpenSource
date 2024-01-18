import React from 'react';
import styled from 'styled-components';
import cx from 'clsx';

import { Popover as ReactTinyPopover } from 'react-tiny-popover';

export type ReactPopoverProps = {
  className?: string;
  fixed?: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof ReactTinyPopover>;

const ReactPopover = ({ className, fixed = false, children, ...rest }: ReactPopoverProps) => {
  return (
    <ReactTinyPopover containerClassName={cx(className, { fixed })} {...rest}>
      {children}
    </ReactTinyPopover>
  );
};

export const Popover = styled(ReactPopover)`
  ${({ theme }) => theme.typography.body}
  z-index: 10000;
  background: ${({ theme }) => theme.palette.system.background};
  min-width: 200px;
  padding: 4px 0;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  &.fixed {
    position: fixed !important;
  }
`;
