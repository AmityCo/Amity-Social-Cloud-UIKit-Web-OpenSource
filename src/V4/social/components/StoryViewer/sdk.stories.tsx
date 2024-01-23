import React from 'react';
import { StoryViewer } from '.';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';

export default {
  title: 'SDK Connected/Social/Story',
};

export const SDKStory = {
  render: () => {
    const communityId = '';
    return <StoryViewer targetId={communityId} />;
  },
  name: 'Story Viewer',
};
