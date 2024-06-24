import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PrimaryButton } from '~/core/components/Button/styles';

export type ConfirmType = {
  onCancel?: () => void;
  onOk?: () => void;
  type?: 'confirm' | 'info';
  OkButton?: ReactNode;
  CancelButton?: ReactNode;
  title?: ReactNode;
  content?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  pageId?: string;
  componentId?: string;
  elementId?: string;
};

interface ConfirmContextProps {
  confirmData: ConfirmType | null;
  confirm: (data: ConfirmType) => void;
  info: (data: ConfirmType) => void;
  closeConfirm: () => void;
}

export const ConfirmContext = createContext<ConfirmContextProps>({
  confirmData: null,
  confirm: (data: ConfirmType) => {},
  info: (data: ConfirmType) => {},
  closeConfirm: () => {},
});

export const useConfirmContext = () => useContext(ConfirmContext);

export const ConfirmProvider: React.FC = ({ children }) => {
  const [confirmData, setConfirmData] = useState<ConfirmType | null>(null);

  const closeConfirm = () => {
    setConfirmData(null);
  };

  const confirm = (confirmData: ConfirmType) => {
    setConfirmData({ ...confirmData, type: 'confirm' });
  };

  const info = (data: ConfirmType) =>
    setConfirmData({ ...data, type: 'info', OkButton: PrimaryButton });

  return (
    <ConfirmContext.Provider value={{ confirmData, confirm, info, closeConfirm }}>
      {children}
    </ConfirmContext.Provider>
  );
};
