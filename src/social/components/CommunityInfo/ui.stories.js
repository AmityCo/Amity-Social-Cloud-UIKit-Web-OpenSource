import React from 'react';

import StyledCommunityInfo from './UICommunityInfo';

export default {
  title: 'Ui Only/Social/Community',
};

// TODO - using hook means that component re-fetches community each time control props are changed.
// Real community is needed because component renders CommunityName component which is SDK-connected.
export const UiCommunityInfo = props => {
  return <StyledCommunityInfo {...props} communityId="" />;
};

UiCommunityInfo.storyName = 'Informations';

UiCommunityInfo.args = {
  communityCategories: ['Category 1'],
  postsCount: 100,
  membersCount: 250,
  description: 'Description of this community',
  isJoined: true,
  canEditCommunity: true,
};

UiCommunityInfo.argTypes = {
  // Use type select instead of array to avoid so many re-renders (and re-fetches of the community)
  communityCategories: {
    control: {
      type: 'select',
      options: [
        ['Category 1'],
        ['Category 2', 'Another category'],
        ['Category 2', 'Another category', 'Third category'],
      ],
    },
  },
  postsCount: { control: { type: 'number' } },
  membersCount: { control: { type: 'number' } },
  description: { control: { type: 'text' } },
  isJoined: { control: { type: 'boolean' } },
  canEditCommunity: { control: { type: 'boolean' } },
  onEditCommunityClick: { action: 'onEditCommunityClick()' },
  joinCommunity: { action: 'joinCommunity()' },
  leaveCommunity: { action: 'leaveCommunity()' },
};
