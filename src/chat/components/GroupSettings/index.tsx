import React, { ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import UIKitInputText from '~/core/components/InputText';

import { InputGroup, Label, WrapContent, FooterContainer, OkButton, CancelButton } from './styles';

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
      data-qa-anchor="group-settings-modal"
      size="small"
      title={title || formatMessage({ id: 'chat.create.modalTitle' })}
      footer={
        <FooterContainer>
          <CancelButton onClick={closeModal}>
            <FormattedMessage id="general.cancel.capital" />
          </CancelButton>
          <OkButton disabled={groupName.length === 0} onClick={submitGroupName}>
            {submitButtonName || <FormattedMessage id="general.create.capital" />}
          </OkButton>
        </FooterContainer>
      }
    >
      <WrapContent>
        <InputGroup>
          <Label>
            <FormattedMessage id="groupChat.createPopup.fieldName" />
          </Label>
          <UIKitInputText
            value={groupName}
            placeholder={formatMessage({ id: 'groupChat.createPopup.placeholder' })}
            onChange={(data) => setGroupName(data.plainText)}
          />
        </InputGroup>
      </WrapContent>
    </Modal>
  );
};

export default GroupSettings;
