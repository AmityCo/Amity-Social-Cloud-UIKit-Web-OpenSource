import React from 'react';

import { LinkPreview } from './LinkPreview';

export default {
  title: 'v4-social/internal-components/LinkPreview',
};

export const LinkPreviewStory = {
  render: () => {
    return (
      <LinkPreview url="https://medium.com/better-humans/how-to-wake%20-up-at-5-a-m-every-day-ceb02e29c802" />
    );
  },

  name: 'LinkPreview',
};
