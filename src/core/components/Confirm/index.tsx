import React from 'react';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

import {
  ConfirmModal,
  Footer,
  DefaultOkButton,
  DefaultCancelButton,
  ConfirmModalContent,
} from './styles';

const Confirm = ({
  'data-qa-anchor': dataQaAnchor = '',
  className,
  title,
  content,
  okText = 'Ok',
  onOk,
  OkButton = DefaultOkButton,
  cancelText = 'Cancel',
  CancelButton = DefaultCancelButton,
  onCancel,
  type = 'confirm',
}: any) => {
  return (
    <ConfirmModal
      data-qa-anchor={`confirm-modal-${dataQaAnchor}`}
      clean
      className={className}
      title={title}
      footer={
        <Footer>
          {type === 'confirm' && (
            <CancelButton data-qa-anchor="confirm-modal-cancel-button" onClick={onCancel}>
              {cancelText}
            </CancelButton>
          )}
          <OkButton data-qa-anchor={`confirm-modal-${dataQaAnchor}-ok-button`} onClick={onOk}>
            {okText}
          </OkButton>
        </Footer>
      }
      onCancel={onCancel}
    >
      <ConfirmModalContent>{content}</ConfirmModalContent>
    </ConfirmModal>
  );
};

// rendered by provider, to allow spawning of confirm from confirm function below
export const ConfirmComponent = () => {
  const { confirmData, closeConfirm } = useConfirmContext();

  if (!confirmData) return null;

  const onCancel = () => {
    closeConfirm();
    confirmData?.onCancel && confirmData.onCancel();
  };

  const onOk = () => {
    closeConfirm();
    confirmData?.onOk && confirmData.onOk();
  };

  return <Confirm {...confirmData} onCancel={onCancel} onOk={onOk} />;
};

export default Confirm;
