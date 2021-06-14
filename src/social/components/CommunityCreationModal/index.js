import React, { memo } from 'react';

import { CommunityRepository } from '@amityco/js-sdk';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import promisify from '~/helpers/promisify';
import { CommunityForm } from './styles';
import withSDK from '~/core/hocs/withSDK';

const MODERATOR_ROLE = 'moderator';

const CommunityCreationModal = ({ isOpen, onClose, currentUserId }) => {
  if (!isOpen) return null;

  const closeConfirm = () =>
    confirm({
      title: 'Leave without finishing?',
      content: 'Your progress won’t be saved. Are you sure to leave this page now?',
      cancelText: 'Continue editing',
      okText: 'Leave',
      onOk: onClose,
    });

  const handleSubmit = async data => {
    const { communityId } = await promisify(CommunityRepository.createCommunity(data));

    await CommunityRepository.assignRoleToUsers({
      communityId,
      role: MODERATOR_ROLE,
      userIds: [currentUserId],
    });
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
