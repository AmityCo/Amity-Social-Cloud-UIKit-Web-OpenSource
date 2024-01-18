import React from 'react';

import { PageTabs } from '~/social/pages/CommunityEdit/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UiCommunityCreatedModal from './CommunityCreatedModal';

interface CommunityCreatedModalProps {
  communityId?: string | null;
  onClose: () => void;
}

const CommunityCreatedModal = ({ communityId, onClose }: CommunityCreatedModalProps) => {
  const { onEditCommunity } = useNavigation();

  const onGoSettings = () => {
    if (communityId == null) return;
    onEditCommunity(communityId, PageTabs.PERMISSIONS);
    onClose();
  };

  return <UiCommunityCreatedModal onClose={onClose} onGoSettings={onGoSettings} />;
};

export default CommunityCreatedModal;
