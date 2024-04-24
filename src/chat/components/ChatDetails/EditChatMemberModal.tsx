import React from 'react';
import { useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';

import Modal from '~/core/components/Modal';
import ChatComposer from '~/chat/components/Chat/ChatComposer';
import { notification } from '~/core/components/Notification';
import EditChatMemberComposer from './EditChatMemberComposer';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

type Props = {
  channelId: string;
  onClose: () => void;
};

const EditChatMemberModal = ({ channelId, onClose }: Props) => {
  const { formatMessage } = useIntl();
  const { confirm } = useConfirmContext();

  const handleSubmit = async (
    data: Parameters<typeof ChannelRepository.Membership.addMembers>[1],
  ) => {
    try {
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
      title: formatMessage({ id: 'editChatMembersModal.confirm.title' }),
      content: formatMessage({ id: 'editChatMembersModal.confirm.content' }),
      cancelText: formatMessage({ id: 'editChatMembersModal.confirm.cancelText' }),
      okText: formatMessage({ id: 'editChatMembersModal.confirm.okText' }),
      onOk: onClose,
    });

  return (
    <Modal
      data-qa-anchor="edit-chat-members-modal"
      title={formatMessage({ id: 'editChatMembersModal.title' })}
      onCancel={closeConfirm}
    >
      <EditChatMemberComposer
        channelId={channelId}
        onSubmit={handleSubmit}
        onCancel={closeConfirm}
      />
    </Modal>
  );
};

export default EditChatMemberModal;
