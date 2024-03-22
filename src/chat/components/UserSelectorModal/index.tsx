import React, { ReactNode, useState } from 'react';
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

interface UserSelectorModalProps {
  title?: ReactNode;
  initialValue?: string[];
  onChange?: (userIds: string[]) => void;
  closeModal?: () => void;
  onOk?: () => void;
  okText?: string;
  disabledOk?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  disabledCancel?: boolean;
}

const UserSelectorModal = ({
  title,
  initialValue = [],
  onChange = () => {},
  closeModal = () => {},
  onOk = () => {},
  okText,
  disabledOk = false,
  onCancel = () => {},
  cancelText,
  disabledCancel = false,
}: UserSelectorModalProps) => {
  const { formatMessage } = useIntl();

  const [query, setQuery] = useState('');
  const [selectedUserIds, updateSelectedUserIds] = useState<string[]>(initialValue);

  // Internal method
  const selectUser = ({ userId }: { userId: string }) => {
    // const currentUserIdState = selectedUserIds?.userId ?? false;

    const newDataUpdate = [...selectedUserIds, userId];
    updateSelectedUserIds(newDataUpdate);

    // // Convert data for onChange event in parent component
    // const userIds = Object.keys(newDataUpdate).reduce<string[]>((acc, key) => {
    //   if (newDataUpdate[key]) {
    //     acc.push(`${key}`);
    //   }
    //   return acc;
    // }, []);

    // Trigger onChange event in parent component
    onChange(newDataUpdate);
  };

  return (
    <Modal
      data-qa-anchor="user-selector-modal"
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
          placeholder={formatMessage({ id: 'userSelector.placeholder' })}
          prepend={
            <PrependIconWrapper>
              <SearchIcon />
            </PrependIconWrapper>
          }
          value={query}
          onChange={(e) => {
            setQuery(e.text);
          }}
        />
      </WrapSearch>

      <WrapResult>
        {query?.length > 0 && (
          <SearchUserList
            excludeSelf
            query={query}
            selectedUserIds={selectedUserIds}
            onUserItemSelected={selectUser}
          />
        )}

        {(!query || query?.length === 0) && (
          <AllUserList
            excludeSelf
            selectedUserIds={selectedUserIds}
            onUserItemSelected={selectUser}
          />
        )}
      </WrapResult>
    </Modal>
  );
};

export default UserSelectorModal;
