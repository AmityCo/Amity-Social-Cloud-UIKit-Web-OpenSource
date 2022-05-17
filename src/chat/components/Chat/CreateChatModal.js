import React from 'react';
import { useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/js-sdk';

import Modal from '~/core/components/Modal';
import ChatComposer from '~/chat/components/Chat/ChatComposer';
import promisify from '~/helpers/promisify';
import { confirm } from '~/core/components/Confirm';

const CreateChatModal = ({ onClose }) => {
  const { formatMessage } = useIntl();

  const handleSubmit = async (data) => {
    await promisify(ChannelRepository.createChannel(data));
    onClose();
  };

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CommunityCreationModal.title' }),
      content: formatMessage({ id: 'CommunityCreationModal.content' }),
      cancelText: formatMessage({ id: 'CommunityCreationModal.cancelText' }),
      okText: formatMessage({ id: 'CommunityCreationModal.okText' }),
      onOk: onClose,
    });

  return (
    <Modal title={formatMessage({ id: 'chat_modal.title' })} onCancel={closeConfirm}>
      <ChatComposer onSubmit={handleSubmit} onCancel={closeConfirm} />
    </Modal>
  );
};

export default CreateChatModal;
