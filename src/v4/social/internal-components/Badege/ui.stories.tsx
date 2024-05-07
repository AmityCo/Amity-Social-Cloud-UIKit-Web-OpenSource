import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Badge } from './Badge';
import { BadgeProps } from './types';
import { ModeratorBadgeIcon } from '~/icons';

export default {
  title: 'V4/Components/Badge',
  component: Badge,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: ['crown', 'star', 'heart'], // Adjust the options based on your available icons
      },
    },
    communityRole: {
      control: 'text',
    },
  },
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: <ModeratorBadgeIcon />,
  communityRole: 'Moderator',
};
