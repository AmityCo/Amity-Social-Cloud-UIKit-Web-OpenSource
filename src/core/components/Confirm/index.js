import React, { useState } from 'react';
import { PrimaryButton } from '~/core/components/Button';

import { ConfirmModal, Footer, DefaultOkButton, DefaultCancelButton } from './styles';

const Confirm = ({
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
}) => (
  <ConfirmModal
    clean
    isOpen
    className={className}
    title={title}
    footer={
      <Footer>
        {type === 'confirm' && <CancelButton onClick={onCancel}>{cancelText}</CancelButton>}
        <OkButton onClick={onOk}>{okText}</OkButton>
      </Footer>
    }
    onCancel={onCancel}
  >
    {content}
  </ConfirmModal>
);

let spawnNewConfirm; // for modfying ConfirmContainer state outside

// rendered by provider, to allow spawning of confirm from confirm function below
export const ConfirmContainer = () => {
  const [confirm, setConfirm] = useState(null);
  spawnNewConfirm = (confirmData) => {
    setConfirm(confirmData);
  };

  if (!confirm) return null;

  const closeConfirm = () => setConfirm(null);

  const attachCanceling = (fn) => () => {
    closeConfirm();
    fn && fn();
  };

  return (
    <Confirm
      {...confirm}
      onCancel={attachCanceling(confirm.onCancel)}
      onOk={attachCanceling(confirm.onOk)}
    />
  );
};

/*
  Usage:
    confirm({
      title: 'Delete post',
      content:
        'This post will be permanently deleted. You’ll no longer to see and find this post. Continue?',
      okText: 'Delete',
      onOk: onDelete,
    });

  This interface rely on ConfirmContainer being rendered by UIKITProvider in the react tree
*/
export const confirm = (confirmData) => spawnNewConfirm({ ...confirmData, type: 'confirm' });

export const info = (data) => spawnNewConfirm({ ...data, type: 'info', OkButton: PrimaryButton });

export default Confirm;
