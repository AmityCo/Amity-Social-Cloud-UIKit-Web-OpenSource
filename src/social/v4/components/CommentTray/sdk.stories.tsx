// CommentTray.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CommentTray } from './CommentTray';

const meta: Meta<typeof CommentTray> = {
  title: 'Social/CommentTray',
  component: CommentTray,
  args: {
    referenceType: 'post',
    referenceId: 'post123',
    community: {
      communityId: 'community123',
      displayName: 'Community 123',
      isPublic: true,
      isJoined: true,
    },
    shouldAllowInteraction: true,
    shouldAllowCreation: true,
    pageId: '*',
    storyId: 'story123',
    isJoined: true,
    allowCommentInStory: true,
  },
};

export default meta;
type Story = StoryObj<typeof CommentTray>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

export const WithReply: Story = {
  args: {
    isOpen: true,
    isReplying: true,
    replyTo: 'comment456',
  },
};

export const WithLimit: Story = {
  args: {
    isOpen: true,
    limit: 10,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const WithComment: Story = {
  render: (args) => {
    // const {comments,isLoading}  = useCommentsCollection({
    //   referenceType:"story",
    //   referenceId:"660a3b7fc5d2301929cff8ce"
    // });

    return <CommentTray {...args} referenceId={'660a3b7fc5d2301929cff8ce'} referenceType="story" />;
  },
  args: {
    isOpen: true,
  },
};
