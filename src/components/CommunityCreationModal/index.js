import React from 'react';
import { customizableComponent } from '../../hoks/customization';
import { confirm } from '../Confirm';
import Modal from '../Modal';
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

export default customizableComponent('CommunityCreationModal')(CommunityCreationModal);
