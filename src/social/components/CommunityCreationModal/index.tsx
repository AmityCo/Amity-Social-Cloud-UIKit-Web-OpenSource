import React, { memo } from 'react';

import { CommunityRepository } from '@amityco/ts-sdk';
import { useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';

import CreateCommunityForm from '../CommunityForm/CreateCommunityForm';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

interface CommunityCreationModalProps {
  isOpen: boolean;
  onClose: (communityId?: string) => void;
}

const CommunityCreationModal = ({ isOpen, onClose }: CommunityCreationModalProps) => {
  const { formatMessage } = useIntl();
  const { confirm } = useConfirmContext();

  if (!isOpen) return null;

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CommunityCreationModal.title' }),
      content: formatMessage({ id: 'CommunityCreationModal.content' }),
      cancelText: formatMessage({ id: 'CommunityCreationModal.cancelText' }),
      okText: formatMessage({ id: 'CommunityCreationModal.okText' }),
      onOk: () => onClose(),
    });

  const handleSubmit = async (data: Parameters<typeof CommunityRepository.createCommunity>[0]) => {
    const community = await CommunityRepository.createCommunity(data);
    onClose(community.data.communityId);
  };

  return (
    <Modal
      data-qa-anchor="community-creation-modal"
      title="Create community"
      onCancel={closeConfirm}
    >
      <CreateCommunityForm
        data-qa-anchor="community-creation"
        onCancel={closeConfirm}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default memo((props: CommunityCreationModalProps) => {
  const CustomComponentFn =
    useCustomComponent<CommunityCreationModalProps>('CommunityCreationModal');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityCreationModal {...props} />;
});
