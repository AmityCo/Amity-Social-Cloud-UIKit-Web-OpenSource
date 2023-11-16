import React from 'react';

import StyledCommunityCard from './UICommunityCard';

export default {
  title: 'Ui Only/Social/Community',
};

// mock categories
const MOCK_CATEGORIES = [
  {
    categoryId: 'categoryId#1',
    name: 'First Category',
  },
  {
    categoryId: 'categoryId#2',
    name: 'Second Category',
  },
  {
    categoryId: 'categoryId#3',
    name: 'Third Category',
  },
];

export const UiCommunityCard = ({ communityCategories, ...props }) => {
  const categories = communityCategories.map((name) =>
    MOCK_CATEGORIES.find((category) => category.name === name),
  );
  return <StyledCommunityCard {...props} communityCategories={categories} />;
};

UiCommunityCard.storyName = 'Card';

UiCommunityCard.args = {
  avatarFileUrl: 'https://cataas.com/cat',
  communityCategories: [],
  membersCount: 250,
  description: 'Description of this community',
  isOfficial: false,
  isPublic: false,
  name: 'Community Name',
};

UiCommunityCard.argTypes = {
  avatarFileUrl: { control: { type: 'text' } },
  communityId: { control: { type: 'text' } },
  communityCategories: {
    control: { type: 'inline-check' },
    options: Object.values(MOCK_CATEGORIES).map(({ name }) => name),
  },
  membersCount: { control: { type: 'number', min: 0, step: 1 } },
  description: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  name: { control: { type: 'text' } },
};
