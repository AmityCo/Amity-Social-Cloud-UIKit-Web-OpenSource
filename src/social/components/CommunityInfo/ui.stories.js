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
  isOfficial: false,
  isPublic: false,
  canEditCommunity: true,
  canLeaveCommunity: false,
  name: 'Community Name',
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
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  canEditCommunity: { control: { type: 'boolean' } },
  canLeaveCommunity: { control: { type: 'boolean' } },
  onEditCommunity: { action: 'onEditCommunity()' },
  joinCommunity: { action: 'joinCommunity()' },
  leaveCommunity: { action: 'leaveCommunity()' },
  name: { control: { type: 'text' } },
};
