import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { PollRepository } from '@amityco/js-sdk';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import PollComposer from '~/social/components/post/PollComposer';
import promisify from '~/helpers/promisify';

const PollModal = ({ isOpen, onClose, onCreatePoll }) => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async data => {
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

  return (
    <Modal
      title={formatMessage({ id: 'poll_modal.title' })}
      onCancel={isDirty ? closeConfirm : onClose}
      clean={false}
    >
      <PollComposer onCancel={closeConfirm} onSubmit={handleSubmit} setDirtyExternal={setDirty} />
    </Modal>
  );
};

export default PollModal;
