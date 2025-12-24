import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModeratorBadge } from './ModeratorBadge';

const meta: Meta<typeof ModeratorBadge> = {
  title: 'v4/Social/Moderator Badge',
  component: ModeratorBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'live'],
      description: 'Badge type - affects the color scheme',
    },
    variant: {
      control: { type: 'select' },
      options: ['textWithIcon', 'iconOnly'],
      description: 'Display variant - shows text with icon or icon only',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// All variations showcase
export const AllVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '12px', color: '#333' }}>Default Type</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ModeratorBadge type="default" variant="textWithIcon" />
            <span style={{ fontSize: '12px', color: '#666' }}>Text with Icon</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ModeratorBadge type="default" variant="iconOnly" />
            <span style={{ fontSize: '12px', color: '#666' }}>Icon Only</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', color: '#333' }}>Live Type</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ModeratorBadge type="live" variant="textWithIcon" />
            <span style={{ fontSize: '12px', color: '#666' }}>Text with Icon</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ModeratorBadge type="live" variant="iconOnly" />
            <span style={{ fontSize: '12px', color: '#666' }}>Icon Only</span>
          </div>
        </div>
      </div>
    </div>
  ),
  name: 'All Variations',
};
