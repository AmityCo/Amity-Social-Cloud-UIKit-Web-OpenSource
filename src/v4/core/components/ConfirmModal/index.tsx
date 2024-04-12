import React, { useState } from 'react';
import Modal from '../Modal';
import { Button } from '~/v4/core/components/Button';
import clsx from 'clsx';
import styles from './styles.module.css';

const Confirm = ({
  'data-qa-anchor': dataQaAnchor = '',
  className,
  title,
  content,
  okText = 'Ok',
  onOk,
  cancelText = 'Cancel',
  onCancel,
  type = 'confirm',
}: any) => (
  <Modal
    className={clsx(className, styles.modal)}
    data-qa-anchor={`confirm-modal-${dataQaAnchor}`}
    title={title}
    footer={
      <div className={styles.footer}>
        {type === 'confirm' && (
          <Button
            className={styles.cancelButton}
            data-qa-anchor="confirm-modal-cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}
        <Button
          className={styles.okButton}
          data-qa-anchor={`confirm-modal-${dataQaAnchor}-ok-button`}
          onClick={onOk}
        >
          {okText}
        </Button>
      </div>
    }
    onCancel={onCancel}
  >
    <div className={styles.modalContent}>{content}</div>
  </Modal>
);

let spawnNewConfirm: any; // for modfying ConfirmContainer state outside

// rendered by provider, to allow spawning of confirm from confirm function below
export const ConfirmContainer = () => {
  const [confirm, setConfirm] = useState<any>(null);
  spawnNewConfirm = (confirmData: any) => {
    setConfirm(confirmData);
  };

  if (!confirm) return null;

  const closeConfirm = () => setConfirm(null);

  const attachCanceling = (fn: any) => () => {
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
export const confirm = (confirmData: any) => spawnNewConfirm({ ...confirmData, type: 'confirm' });

export const info = (data: any) => spawnNewConfirm({ ...data, type: 'info' });

export default Confirm;
