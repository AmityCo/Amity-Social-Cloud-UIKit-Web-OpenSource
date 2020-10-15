import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';
import CommunityInfo, { UICommunityInfo as CommunityInfoComponent } from '.';

export default {
  title: 'Components/Community/Information',
  parameters: { layout: 'centered' },
};

// TODO - using hook means that component re-fetches community each time control props are changed.
// Real community is needed because component renders CommunityName component which is SDK-connected.
export const UICommunityInfo = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityInfoComponent {...props} communityId={community.communityId || ''} />;
};

UICommunityInfo.args = {
  communityCategories: ['Category 1'],
  postsCount: 100,
  membersCount: 250,
  description: 'Description of this community',
  isJoined: true,
  canEditCommunity: true,
};

UICommunityInfo.argTypes = {
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
  onEditCommunityClick: { action: 'Going to edit community' },
  joinCommunity: { action: 'Community joined' },
  leaveCommunity: { action: 'Leaving community' },
};

export const SDKCommunityInfo = () => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityInfo communityId={community.communityId} />;
};
