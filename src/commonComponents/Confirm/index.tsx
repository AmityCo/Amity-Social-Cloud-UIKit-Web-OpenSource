import React, { useState } from 'react';

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
}) => (
  <ConfirmModal
    clean
    className={className}
    onCancel={onCancel}
    title={title}
    footer={
      <Footer>
        <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
        <OkButton onClick={onOk}>{okText}</OkButton>
      </Footer>
    }
  >
    {content}
  </ConfirmModal>
);

let spawnNewConfirm;

// rendered by provider, to allow spawning of confirm from confirm function below
export const ConfirmContainer = () => {
  const [confirm, setConfirm] = useState(null);
  spawnNewConfirm = confirmData => {
    setConfirm(confirmData);
  };

  if (!confirm) return null;

  const attachConfirmCanceling = fn => () => {
    fn && fn();
    setConfirm(null);
  };

  return (
    <Confirm
      {...confirm}
      onCancel={attachConfirmCanceling(confirm.onCancel)}
      onOk={attachConfirmCanceling(confirm.onOk)}
    />
  );
};

export const confirm = confirmData => spawnNewConfirm(confirmData);

setTimeout(() => {
  confirm({
    title: 'title',
    content: 'content',
  });
  console.log('confirmm!!');
}, 1000);

export default Confirm;
