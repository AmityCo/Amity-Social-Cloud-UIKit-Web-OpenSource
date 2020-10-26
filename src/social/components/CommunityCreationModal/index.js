import React from 'react';
import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import { CommunityForm } from './styles';

const CommunityCreationModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const closeConfirm = () =>
    confirm({
      title: 'Leave without finishing?',
      content: 'Your progress won’t be saved. Are you sure to leave this page now?',
      cancelText: 'Continue editing',
      okText: 'Leave',
      onOk: onClose,
    });

  return (
    <Modal title="Create community" onCancel={closeConfirm}>
      <CommunityForm
        onCancel={closeConfirm}
        onSubmit={data => {
          onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
};

export default customizableComponent('CommunityCreationModal', CommunityCreationModal);
