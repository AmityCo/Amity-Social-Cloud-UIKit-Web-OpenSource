import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import { PageTabs } from '~/social/pages/CommunityEdit/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UiCommunityCreatedModal from './CommunityCreatedModal';

const CommunityCreatedModal = ({ communityId, onClose }) => {
  const { onEditCommunity } = useNavigation();

  const onGoSettings = () => {
    onEditCommunity(communityId, PageTabs.PERMISSIONS);
    onClose();
  };

  return (
    <UiCommunityCreatedModal
      communityId={communityId}
      onClose={onClose}
      onGoSettings={onGoSettings}
    />
  );
};

export default customizableComponent('CommunityCreatedModal', CommunityCreatedModal);
