import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PollRepository } from '@amityco/ts-sdk';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import PollComposer from '~/social/components/post/PollComposer';
import { notification } from '~/core/components/Notification';
import { ERROR_RESPONSE } from '~/social/constants';

interface PollModalProps {
  targetId?: string | null;
  targetType: any;
  onClose: () => void;
  onCreatePoll: (
    pollId: string,
    question: string,
    mentionees: Amity.UserMention[],
    metadata: Record<string, unknown>,
  ) => void;
}

const PollModal = ({ targetId, targetType, onClose, onCreatePoll }: PollModalProps) => {
  const [isDirty, setDirty] = useState(false);
  const { formatMessage } = useIntl();

  const handleSubmit = async (
    data: Parameters<typeof PollRepository.createPoll>[0],
    mentionees: Amity.UserMention[],
    metadata: Record<string, unknown>,
  ) => {
    try {
      const createdPoll = await PollRepository.createPoll(data);
      await onCreatePoll(createdPoll.data.pollId, data.question, mentionees, metadata);
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === ERROR_RESPONSE.CONTAIN_BLOCKED_WORD) {
          notification.error({
            content: <FormattedMessage id="notification.error.blockedWord" />,
          });
        }
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
      data-qa-anchor="poll-composer-modal"
      title={formatMessage({ id: 'poll_modal.title' })}
      clean={false}
      onCancel={isDirty ? closeConfirm : onClose}
    >
      <PollComposer
        targetId={targetId}
        targetType={targetType}
        onIsDirtyChange={(newValue) => setDirty(newValue)}
        onCancel={closeConfirm}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default PollModal;
