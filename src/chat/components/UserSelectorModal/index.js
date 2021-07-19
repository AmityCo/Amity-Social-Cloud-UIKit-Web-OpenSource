import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import SearchIcon from '~/icons/Search';
import Modal from '~/core/components/Modal';
import UIKitInputText from '~/core/components/InputText';

import { AllUserList, SearchUserList } from './ContactList';

import {
  PrependIconWrapper,
  WrapSearch,
  WrapResult,
  FooterContainer,
  OkButton,
  CancelButton,
} from './styles';

const UserSelectorModal = ({
  title = null,
  initialValue = [],
  onChange = () => {},
  closeModal = () => {},
  onOk = () => {},
  okText = null,
  disabledOk = false,
  onCancel = () => {},
  cancelText = null,
  disabledCancel = false,
}) => {
  const { formatMessage } = useIntl();

  const [query, setQuery] = useState('');
  const [selectedUserIds, updateSelectedUserIds] = useState(
    initialValue.reduce((acc, initialUserId) => {
      acc[initialUserId] = true;
      return acc;
    }, {}),
  );

  // Internal method
  const selectUser = ({ userId }) => {
    const currentUserIdState = selectedUserIds?.userId ?? false;

    const newDataUpdate = { ...selectedUserIds, [userId]: !currentUserIdState };
    updateSelectedUserIds(newDataUpdate);

    // Convert data for onChange event in parent component
    const userIds = Object.keys(newDataUpdate).reduce((acc, key) => {
      if (newDataUpdate[key]) {
        acc.push(key);
      }
      return acc;
    }, []);

    // Trigger onChage event in parent component
    onChange(userIds);
  };

  return (
    <Modal
      isOpen={false}
      size="small"
      title={title || formatMessage({ id: 'chat.create.modalTitle' })}
      footer={
        <FooterContainer>
          <CancelButton
            disabled={disabledCancel}
            onClick={() => {
              onCancel();
              closeModal();
            }}
          >
            {cancelText || formatMessage({ id: 'general.cancel.capital' })}
          </CancelButton>
          <OkButton disabled={disabledOk} onClick={onOk}>
            {okText || formatMessage({ id: 'general.done.capital' })}
          </OkButton>
        </FooterContainer>
      }
      onCancel={closeModal}
    >
      <WrapSearch>
        <UIKitInputText
          autofocus
          placeholder={formatMessage({ id: 'userSelector.placeholder' })}
          prepend={
            <PrependIconWrapper>
              <SearchIcon />
            </PrependIconWrapper>
          }
          value={query}
          onChange={setQuery}
        />
      </WrapSearch>

      <WrapResult>
        {query.length > 0 && (
          <SearchUserList
            excludeSelf
            query={query}
            onUserItemSelected={selectUser}
            selectedUserIds={selectedUserIds}
          />
        )}

        {query.length === 0 && (
          <AllUserList
            excludeSelf
            onUserItemSelected={selectUser}
            selectedUserIds={selectedUserIds}
          />
        )}
      </WrapResult>
    </Modal>
  );
};

export default UserSelectorModal;
