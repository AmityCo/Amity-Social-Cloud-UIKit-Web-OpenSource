import React from 'react';

import { CommunityRepository } from 'eko-sdk';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import { CommunityForm } from './styles';

const CommunityCreationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const createCommunity = async ({
    displayName,
    description,
    avatarFileId,
    tags,
    userIds,
    isPublic,
  }) => {
    const community = await CommunityRepository.createCommunity({
      displayName,
      description,
      avatarFileId,
      tags,
      userIds,
      isPublic,
    });

    return community;
  };

  const closeConfirm = () =>
    confirm({
      title: 'Leave without finishing?',
      content: 'Your progress won’t be saved. Are you sure to leave this page now?',
      cancelText: 'Continue editing',
      okText: 'Leave',
      onOk: onClose,
    });

  const handleSubmit = async data => {
    const { communityId } = await createCommunity(data);

    onClose(communityId);
  };

  return (
    <Modal title="Create community" onCancel={closeConfirm}>
      <CommunityForm onCancel={closeConfirm} onSubmit={handleSubmit} />
    </Modal>
  );
};

export default customizableComponent('CommunityCreationModal', CommunityCreationModal);
