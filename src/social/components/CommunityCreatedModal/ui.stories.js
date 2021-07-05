import React from 'react';
import CommunityCreatedModal from './CommunityCreatedModal';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityCreatedModal = args => {
  return <CommunityCreatedModal {...args} />;
};

UiCommunityCreatedModal.storyName = 'CommunityCreatedModal';

UiCommunityCreatedModal.argTypes = {
  onClose: { action: 'onClose()' },
  onGoSettings: { action: 'onGoSettings()' },
};
