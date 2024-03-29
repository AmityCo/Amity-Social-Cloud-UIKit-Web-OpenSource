import React from 'react';
import TrendingItem from './UITrendingItem';
import { useArgs } from '@storybook/client-api';

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

export const UITrendingItem = {
  render: () => {
    const [{ communityCategories, ...props }] = useArgs();
    const categories = communityCategories.map((name) =>
      MOCK_CATEGORIES.find((category) => category.name === name),
    );

    return <TrendingItem {...props} categories={categories} />;
  },

  name: 'Trending Item',

  args: {
    avatarFileUrl: 'https://cataas.com/cat',
    description: 'Description of the community',
    communityCategories: [],
    membersCount: 10000,
    slim: false,
    isOfficial: false,
    isPublic: false,
    name: 'Community Name',
    loading: false,
  },

  argTypes: {
    communityCategories: {
      control: { type: 'inline-check' },
      options: Object.values(MOCK_CATEGORIES).map(({ name }) => name),
    },
    slim: { control: { type: 'boolean' } },
    onClick: { action: 'onClick(communityId)' },
    isOfficial: { control: { type: 'boolean' } },
    isPublic: { control: { type: 'boolean' } },
    name: { control: { type: 'text' } },
    loading: { control: { type: 'boolean' } },
  },
};
