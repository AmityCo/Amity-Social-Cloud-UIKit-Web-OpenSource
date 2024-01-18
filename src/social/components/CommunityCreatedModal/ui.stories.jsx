import React from 'react';
import CommunityCreatedModal from './CommunityCreatedModal';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityCreatedModal = {
  render: () => {
    const [props] = useArgs();
    return <CommunityCreatedModal {...props} />;
  },

  name: 'CommunityCreatedModal',

  argTypes: {
    onClose: { action: 'onClose()' },
    onGoSettings: { action: 'onGoSettings()' },
  },
};
