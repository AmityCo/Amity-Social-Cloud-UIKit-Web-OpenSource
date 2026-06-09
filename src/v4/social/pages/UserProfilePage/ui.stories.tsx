import React from 'react';
import { UserProfilePage } from './UserProfilePage';
import { Meta, StoryObj } from '@storybook/react';
import { PageRenderer } from '~/v4/core/providers';

const meta: Meta<typeof UserProfilePage> = {
  tags: ['autodocs'],
  component: UserProfilePage,
  args: { userId: 'Web-Test' },
  title: 'v4/social/pages/UserProfilePage',
  argTypes: { userId: { control: { type: 'text' } } },
};

export default meta;

type StoryProps = StoryObj<typeof UserProfilePage>;

export const Story: StoryProps = {
  render: (props) => {
    return (
      <PageRenderer>
        <UserProfilePage {...props} />
      </PageRenderer>
    );
  },
};
