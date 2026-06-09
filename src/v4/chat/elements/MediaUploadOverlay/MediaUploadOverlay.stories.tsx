import type { Meta, StoryObj } from '@storybook/react';
import { MediaUploadOverlay } from './MediaUploadOverlay';

const meta: Meta<typeof MediaUploadOverlay> = {
  component: MediaUploadOverlay,
  title: 'v4/chat/elements/MediaUploadOverlay',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '15rem',
          height: '15rem',
          background: 'linear-gradient(135deg, #c084fc 0%, #f97316 50%, #8b5cf6 100%)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MediaUploadOverlay>;

export const WithCancel: Story = {
  name: 'Uploading (cancellable)',
  args: {
    onCancel: () => alert('Cancel pressed'),
  },
};

export const SpinnerOnly: Story = {
  name: 'Uploading (no cancel)',
  args: {
    onCancel: undefined,
  },
};
