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
  className?: string;
}

export const BottomSheet = ({ children, headerTitle, ...props }: BottomSheetProps) => {
  return (
    <Sheet {...props}>
      <Sheet.Container className={styles.bottomSheet__container}>
        <Sheet.Header>
          <Sheet.Header />
          {headerTitle && (
            <Sheet.Header className={styles.bottomSheet__header}>
              <Typography.Title>{headerTitle}</Typography.Title>
            </Sheet.Header>
          )}
        </Sheet.Header>
        <Sheet.Content className={styles.bottomSheet__content}>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={props.onClose} />
    </Sheet>
  );
};
