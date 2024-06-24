import React from 'react';

import { CreateCommunityButton } from './CreateCommunityButton';

export default {
  title: 'v4-social/elements/CreateCommunityButton',
};

export const CreateCommunityButtonStory = {
  render: () => {
    return <CreateCommunityButton onClick={() => console.log('CreateCommunityButton clicked')} />;
  },

  name: 'CreateCommunityButton',
};
