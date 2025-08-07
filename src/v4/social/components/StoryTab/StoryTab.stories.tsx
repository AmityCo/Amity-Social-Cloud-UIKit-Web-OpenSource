import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PageRenderer } from '~/v4/core/providers';
import { StoryTab } from '~/v4/social/components/StoryTab';

const meta: Meta<typeof StoryTab> = {
  tags: ['autodocs'],
  component: StoryTab,
  args: { type: 'globalFeed' },
  title: 'v4-social/components/StoryTab',
};

export default meta;

type StoryProps = StoryObj<typeof StoryTab>;

export const Story: StoryProps = {
  render: (props) => {
    return (
      <PageRenderer>
        <StoryTab {...props} />
      </PageRenderer>
    );
  },
};
