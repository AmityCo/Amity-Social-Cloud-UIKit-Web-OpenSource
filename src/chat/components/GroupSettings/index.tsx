import React, { ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import UIKitInputText from '~/core/components/InputText';
import { PrimaryButton, SecondaryButton } from '~/core/components/Button';

import styles from './styles.module.css';

interface GroupSettingsProps {
  closeModal?: () => void;
  submitButtonName?: string;
  onSubmit?: (groupName: string) => void;
  chatName?: string;
  title?: ReactNode;
}

const GroupSettings = ({
  closeModal,
  submitButtonName = '',
  onSubmit,
  chatName = '',
  title,
}: GroupSettingsProps) => {
  const { formatMessage } = useIntl();
  const [groupName, setGroupName] = useState(chatName);

  const submitGroupName = () => {
    onSubmit?.(groupName);
    closeModal?.();
  };

  return (
    <Modal
      data-testid="group-settings-modal"
      size="small"
      title={title || formatMessage({ id: 'chat.create.modalTitle' })}
      footer={
        <div className={styles.footerContainer}>
          <SecondaryButton onClick={closeModal}>
            <FormattedMessage id="general.cancel.capital" />
          </SecondaryButton>
          <PrimaryButton
            className={styles.okButton}
            disabled={groupName.length === 0}
            onClick={submitGroupName}
          >
            <FormattedMessage id="done" />
          </PrimaryButton>
        </div>
      }
    >
      <div className={styles.wrapContent}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FormattedMessage id="groupChat.createPopup.fieldName" />
          </label>
          <UIKitInputText
            value={groupName}
            placeholder={formatMessage({ id: 'groupChat.createPopup.placeholder' })}
            onChange={(data) => setGroupName(data.plainText)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GroupSettings;
