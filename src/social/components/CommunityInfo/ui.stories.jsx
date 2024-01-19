import { CommunityPostSettings } from '@amityco/ts-sdk';
import React from 'react';

import StyledCommunityInfo from './UICommunityInfo';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityInfo = {
  render: () => {
    const [props] = useArgs();
    return <StyledCommunityInfo {...props} communityId="" />;
  },

  name: 'Informations',

  args: {
    communityCategories: ['Category 1'],
    postsCount: 100,
    membersCount: 250,
    description: 'Description of this community',
    isJoined: true,
    isOfficial: false,
    isPublic: false,
    avatarFileUrl: 'https://picsum.photos/530/350',
    canEditCommunity: true,
    canLeaveCommunity: false,
    canReviewPosts: false,
    name: 'Community Name',
    pendingPostsCount: 1,
    postSetting: false,
  },

  argTypes: {
    // Use type select instead of array to avoid so many re-renders (and re-fetches of the community)
    communityCategories: {
      control: { type: 'select' },
      options: [
        ['Category 1'],
        ['Category 2', 'Another category'],
        ['Category 2', 'Another category', 'Third category'],
      ],
    },
    postsCount: { control: { type: 'number' } },
    membersCount: { control: { type: 'number' } },
    description: { control: { type: 'text' } },
    isJoined: { control: { type: 'boolean' } },
    isOfficial: { control: { type: 'boolean' } },
    isPublic: { control: { type: 'boolean' } },
    avatarFileUrl: { control: { type: 'text' } },
    canEditCommunity: { control: { type: 'boolean' } },
    canLeaveCommunity: { control: { type: 'boolean' } },
    onEditCommunity: { action: 'onEditCommunity()' },
    joinCommunity: { action: 'joinCommunity()' },
    leaveCommunity: { action: 'leaveCommunity()' },
    canReviewPosts: { control: { type: 'boolean' } },
    name: { control: { type: 'text' } },
    pendingPostsCount: { control: { type: 'number' } },
    postSetting: {
      control: { type: 'select' },
      // TODO: check CommunityPostSettings
      options: Object.values(CommunityPostSettings),
    },
  },
};
