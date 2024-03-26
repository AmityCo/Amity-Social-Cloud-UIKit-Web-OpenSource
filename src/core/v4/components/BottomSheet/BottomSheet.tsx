import React from 'react';
import { MobileSheet } from './styles';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  rootId?: string;
  mountPoint?: HTMLElement;
  detent?: 'content-height' | 'full-height';
  'data-qa-anchor'?: string;
}

export const BottomSheet = ({
  isOpen = false,
  onClose = () => {},
  detent = 'content-height',
  rootId,
  children,
  mountPoint,
  ...props
}: BottomSheetProps) => {
  return (
    <MobileSheet
      rootId={rootId}
      isOpen={isOpen}
      onClose={onClose}
      mountPoint={mountPoint}
      detent={detent}
      {...props}
    >
      {children}
    </MobileSheet>
  );
};
