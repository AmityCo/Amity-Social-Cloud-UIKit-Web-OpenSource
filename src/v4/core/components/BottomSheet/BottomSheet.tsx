import React from 'react';
import Sheet from 'react-modal-sheet';
import { Typography } from '~/v4/core/components/Typography';

import styles from './BottomSheet.module.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  rootId?: string;
  mountPoint?: HTMLElement;
  detent?: 'content-height' | 'full-height';
  headerTitle?: string;
  cancelText?: string;
  okText?: string;
}

export const BottomSheet = ({ children, headerTitle, ...props }: BottomSheetProps) => {
  return (
    <Sheet {...props}>
      <Sheet.Container className={styles['react-modal-sheet-container']}>
        <Sheet.Header
          style={{
            background: 'var(--asc-color-base-background)',
          }}
        />
        {headerTitle && (
          <Sheet.Header className={styles['react-modal-sheet-header']}>
            <Typography.Title>{headerTitle}</Typography.Title>
          </Sheet.Header>
        )}
        <Sheet.Content className={styles['react-modal-sheet-content']}>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop className={styles['react-modal-sheet-backdrop']} onTap={props.onClose} />
    </Sheet>
  );
};
