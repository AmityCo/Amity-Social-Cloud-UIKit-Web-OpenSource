import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import UIKitInputText from '~/core/components/InputText';

import { InputGroup, Label, WrapContent, FooterContainer, OkButton, CancelButton } from './styles';

const GroupSettings = ({
  closeModal,
  submitButtonName = '',
  onSubmit = () => {},
  chatName = '',
  title = '',
}) => {
  const { formatMessage } = useIntl();
  const [groupName, setGroupName] = useState(chatName);

  const submitGroupName = () => {
    onSubmit(groupName);
    closeModal();
  };

  return (
    <Modal
      isOpen={false}
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
            autofocus
            value={groupName}
            placeholder={formatMessage({ id: 'groupChat.createPopup.placeholder' })}
            onChange={setGroupName}
          />
        </InputGroup>
      </WrapContent>
    </Modal>
  );
};

export default GroupSettings;
