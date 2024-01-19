import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CommunityPermissions from './CommunityPermissions';
import { useArgs } from '@storybook/client-api';

const meta: Meta<typeof CommunityPermissions> = {
  component: CommunityPermissions,
  title: 'Ui Only/Social/Community',
};

export default meta;
type Story = StoryObj<typeof CommunityPermissions>;

export const UiCommunityPermissions: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <CommunityPermissions
        {...args}
        onNeedApprovalOnPostCreationChange={(newValue) =>
          updateArgs({ needApprovalOnPostCreation: newValue })
        }
      />
    );
  },

  args: {
    needApprovalOnPostCreation: false,
  },

  argTypes: {
    onNeedApprovalOnPostCreationChange: { action: 'onNeedApprovalOnPostCreationChange()' },
  },
};
