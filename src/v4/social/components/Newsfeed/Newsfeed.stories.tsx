import React from 'react';
import { useString } from '~/v4/core/localization';

import { Newsfeed } from './Newsfeed';

export default {
  title: 'v4/social/components/Newsfeed',
};

export const NewsfeedStory = {
  render: () => {
    return <Newsfeed />;
  },

  name: useString('amity_social_button_social_home_newsfeed_button'),
};
