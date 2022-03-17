import React, { memo } from 'react';

import { CommunityRepository } from '@amityco/js-sdk';
import { useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import promisify from '~/helpers/promisify';
import { CommunityForm } from './styles';
import withSDK from '~/core/hocs/withSDK';

const CommunityCreationModal = ({ isOpen, onClose }) => {
  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CommunityCreationModal.title' }),
      content: formatMessage({ id: 'CommunityCreationModal.content' }),
      cancelText: formatMessage({ id: 'CommunityCreationModal.cancelText' }),
      okText: formatMessage({ id: 'CommunityCreationModal.okText' }),
      onOk: onClose,
    });

  const handleSubmit = async (data) => {
    const { communityId } = await promisify(CommunityRepository.createCommunity(data));
    onClose(communityId);
  };

  return (
    <Modal title="Create community" onCancel={closeConfirm}>
      <CommunityForm onCancel={closeConfirm} onSubmit={handleSubmit} />
    </Modal>
  );
};

export default memo(
  withSDK(customizableComponent('CommunityCreationModal', CommunityCreationModal)),
);
