import React from 'react';
import { Story, Meta } from '@storybook/react';
import { CommunityProfilePage } from './CommunityProfilePage';

export default {
  title: 'v4-social/pages/CommunityProfilePage',
  component: CommunityProfilePage,
  argTypes: {
    community: { control: 'object' },
    featuredPost: { control: 'object' },
  },
} as Meta;

const Template: Story<{ community: any; featuredPost: any }> = (args) => (
  <CommunityProfilePage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  community: {
    name: 'Planet Savers',
    headerImage: 'https://picsum.photos/800/400', // Placeholder image
    tags: ['Environment', 'Forest', 'Earth Saver', 'Climate Change'],
    description:
      'A community dedicated to communicating climate & justice. Another world is possible 🌍 Join us.',
    posts: 135600,
    members: 45600,
  },
  featuredPost: {
    authorName: 'Jackie Jones',
    authorRole: 'Moderator',
    authorAvatar: 'https://picsum.photos/100/100', // Placeholder image
    date: '12 Jan',
    title: 'Community Rules',
    content:
      'Welcome to Planet Savers! To keep our community positive, please follow these rules:\n\nBe Respectful: No hate speech or bullying.\nStay On Topic: Focus on sustainability and climate action.\nNo Spam: Avoid irrelevant posts.\nCite Sources: Share credible info.\nEngage Positively: Support fellow members.',
    likes: 10500,
    comments: 10,
  },
};

export const NoFeaturedPost = Template.bind({});
NoFeaturedPost.args = {
  community: {
    name: 'Ocean Guardians',
    headerImage: 'https://picsum.photos/800/400?random=1', // Different placeholder image
    tags: ['Ocean', 'Marine Life', 'Conservation'],
    description: 'Protecting our oceans, one action at a time. Dive in and make a difference!',
    posts: 50000,
    members: 20000,
  },
  featuredPost: null,
};

export const LongDescription = Template.bind({});
LongDescription.args = {
  community: {
    name: 'Green Energy Innovators',
    headerImage: 'https://picsum.photos/800/400?random=2', // Another different placeholder image
    tags: ['Renewable Energy', 'Innovation', 'Sustainability'],
    description:
      "Exploring and promoting cutting-edge green energy solutions. From solar and wind to emerging technologies, we're at the forefront of the renewable revolution. Join us in powering a sustainable future!",
    posts: 75000,
    members: 30000,
  },
  featuredPost: {
    authorName: 'Alex Green',
    authorRole: 'Energy Expert',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    date: '15 Feb',
    title: 'The Future of Solar Energy',
    content:
      "Solar technology is advancing at an incredible pace. In this post, we'll explore the latest breakthroughs and what they mean for our clean energy future.",
    likes: 5000,
    comments: 120,
  },
};
