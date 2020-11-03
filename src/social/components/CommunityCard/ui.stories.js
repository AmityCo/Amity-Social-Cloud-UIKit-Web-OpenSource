import React from 'react';

import StyledCommunityCard from './styles';

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
  const categories = communityCategories.map(name =>
    MOCK_CATEGORIES.find(category => category.name === name),
  );
  return <StyledCommunityCard {...props} communityCategories={categories} />;
};

UiCommunityCard.storyName = 'Card';

UiCommunityCard.args = {
  avatarFileUrl: 'https://cataas.com/cat',
  communityId: 'f42c39be6165a292a1dca29b703e2e51', // picked up randomly in a query
  communityCategories: [],
  membersCount: 250,
  description: 'Description of this community',
};

UiCommunityCard.argTypes = {
  avatarFileUrl: { control: { type: 'text' } },
  communityId: { control: { type: 'text' } },
  communityCategories: {
    control: {
      type: 'inline-check',
      options: Object.values(MOCK_CATEGORIES).map(({ name }) => name),
    },
  },
  membersCount: { control: { type: 'number', min: 0, step: 1 } },
  description: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
};
