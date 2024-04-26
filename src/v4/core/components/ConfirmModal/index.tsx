import React from 'react';
import Modal from '~/v4/core/components/Modal';
import { Button } from '~/v4/core/components/Button';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

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
    <div className={styles.confirmModalContent}>{content}</div>
  </Modal>
);

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
