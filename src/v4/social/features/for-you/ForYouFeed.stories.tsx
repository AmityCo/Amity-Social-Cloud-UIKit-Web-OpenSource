import React from 'react';
import { useString } from '~/v4/core/localization';

import { ForYouFeed } from './ForYouFeed';

export default {
  title: 'v4-social/features/ForYouFeed',
};

export const ForYouFeedStory = {
  render: () => {
    return <ForYouFeed pageId="social_home_page" />;
  },

  name: useString('amity_social_button_social_home_for_you_button'),
};
