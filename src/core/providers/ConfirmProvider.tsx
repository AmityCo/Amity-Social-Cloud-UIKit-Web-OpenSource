import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PrimaryButton } from '../components/Button/styles';

type ConfirmType = {
  onCancel?: () => void;
  onOk?: () => void;
  type?: 'confirm' | 'info';
  OkButton?: ReactNode;
  CancelButton?: ReactNode;
  title?: ReactNode;
  content?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  'data-qa-anchor'?: string;
  onSuccess?: () => void;
};

interface ConfirmContextProps {
  confirmData: ConfirmType | null;
  confirm: (data: ConfirmType) => void;
  info: (data: ConfirmType) => void;
  closeConfirm: () => void;
}

export const ConfirmContext = createContext<ConfirmContextProps>({
  confirmData: null,
  confirm: () => {},
  info: () => {},
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
