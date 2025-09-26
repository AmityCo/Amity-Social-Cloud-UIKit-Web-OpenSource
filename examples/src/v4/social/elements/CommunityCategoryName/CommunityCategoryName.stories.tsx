import React from 'react';

import { CommunityCategoryName } from './CommunityCategoryName';

export default {
  title: 'v4-social/elements/CommunityCategoryName',
};

export const CreateCommunityButtonStory = {
  render: () => {
    return <CommunityCategoryName categoryName="pet" />;
  },

  name: 'CommunityCategoryName',
};
