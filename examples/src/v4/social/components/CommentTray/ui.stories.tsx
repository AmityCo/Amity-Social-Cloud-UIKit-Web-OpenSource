import { StoryObj } from '@storybook/react';
import React from 'react';
import { CommentTray } from './CommentTray';

export default {
  title: 'v4-social/components/CommentTrayComponent',
  component: CommentTray,
  argTypes: {
    referenceType: {
      control: 'select',
      options: ['content', 'post', 'story'],
    },
    referenceId: {
      control: 'text',
    },
    shouldAllowInteraction: {
      control: 'boolean',
    },
    shouldAllowCreation: {
      control: 'boolean',
    },
  },
};

type Story = StoryObj<typeof CommentTray>;

export const CommentTrayComponent: Story = {
  render: (args) => {
    return (
      <CommentTray
        community={args.community}
        referenceType={args.referenceType}
        referenceId={args.referenceId}
        shouldAllowInteraction={args.shouldAllowInteraction}
        shouldAllowCreation={args.shouldAllowCreation}
      />
    );
  },
  args: {
    referenceType: 'story',
    referenceId: '',
    shouldAllowInteraction: true,
    shouldAllowCreation: true,
  },
  name: 'CommentTrayComponent',
};
