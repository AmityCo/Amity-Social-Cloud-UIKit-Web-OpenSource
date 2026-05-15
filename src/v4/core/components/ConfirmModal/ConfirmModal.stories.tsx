import React from 'react';
import { resolveString } from '~/v4/core/localization';
import { ConfirmModal } from '.';
import { StoryObj, Meta } from '@storybook/react';
import { Button } from '~/v4/core/components/AriaButton';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

const meta: Meta<typeof ConfirmModal> = {
  component: ConfirmModal,
  title: 'V4/Core/Components/ConfirmModal',
  decorators: [
    (Story) => (
      <div
        style={{
          gap: '1rem',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const { confirm } = useConfirmContext();

    return (
      <Button
        size="medium"
        variant="fill"
        color="primary"
        onPress={() => {
          confirm({
            type: 'confirm',
            pageId: 'confirm',
            okText: resolveString('amity_social_button_discard'),
            onOk: () => alert('ok'),
            cancelText: resolveString('amity_common_keep_editing'),
            title: resolveString('amity_social_modal_dialog_title_discard_post'),
            content: resolveString('amity_social_modal_dialog_discard_post'),
          });
        }}
      >
        Click me
      </Button>
    );
  },
};
