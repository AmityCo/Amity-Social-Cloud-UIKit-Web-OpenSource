import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { PollRepository } from '@amityco/js-sdk';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import PollComposer from '~/social/components/post/PollComposer';
import promisify from '~/helpers/promisify';

const PollModal = ({ isOpen, onClose, onCreatePoll }) => {
  const handleSubmit = async (data) => {
    const { pollId } = await promisify(PollRepository.createPoll(data));
    await onCreatePoll(pollId, data.question);
    onClose();
  };

  const [isDirty, setDirty] = useState(false);

  const { formatMessage } = useIntl();

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CommunityCreationModal.title' }),
      content: formatMessage({ id: 'CommunityCreationModal.content' }),
      cancelText: formatMessage({ id: 'CommunityCreationModal.cancelText' }),
      okText: formatMessage({ id: 'CommunityCreationModal.okText' }),
      onOk: onClose,
    });

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      title={formatMessage({ id: 'poll_modal.title' })}
      clean={false}
      onCancel={isDirty ? closeConfirm : onClose}
    >
      <PollComposer setDirtyExternal={setDirty} onCancel={closeConfirm} onSubmit={handleSubmit} />
    </Modal>
  );
};

export default PollModal;
