import React from 'react';
import { useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';

import Modal from '~/core/components/Modal';
import ChatComposer from '~/chat/components/Chat/ChatComposer';
import { confirm } from '~/core/components/Confirm';
import { notification } from '~/core/components/Notification';

type Props = {
  onClose: () => void;
};

const CreateChatModal = ({ onClose }: Props) => {
  const { formatMessage } = useIntl();

  const handleSubmit = async (data: Parameters<typeof ChannelRepository.createChannel>[0]) => {
    try {
      await ChannelRepository.createChannel(data);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          content: error.message,
        });
      }
    }
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
    <Modal
      data-qa-anchor="create-chat-modal"
      title={formatMessage({ id: 'chat_modal.title' })}
      onCancel={closeConfirm}
    >
      <ChatComposer onSubmit={handleSubmit} onCancel={closeConfirm} />
    </Modal>
  );
};

export default CreateChatModal;
