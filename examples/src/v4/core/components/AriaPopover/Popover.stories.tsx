import { Popover } from '.';
import { StoryObj, Meta } from '@storybook/react';
import { Button } from '~/v4/core/components/AriaButton';
import React, { Fragment, useState, useRef } from 'react';

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'V4/Core/Components/Popover',
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

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <Popover trigger={{ pageId: 'pageId' }}>
        {({ closePopover }) => (
          <div style={{ padding: '1rem', display: 'grid', gap: '0.5rem' }}>
            <Button variant="fill" color="primary" size="medium" onPress={closePopover}>
              Button1
            </Button>
            <Button variant="fill" color="primary" size="medium" onPress={closePopover}>
              Button2
            </Button>
          </div>
        )}
      </Popover>
    );
  },
};

export const Trigger: Story = {
  name: 'Trigger',
  render: () => {
    return (
      <Popover
        trigger={({ openPopover }) => (
          <Button size="medium" variant="fill" color="primary" onPress={openPopover}>
            Click me
          </Button>
        )}
      >
        {({ closePopover }) => (
          <div style={{ padding: '1rem', display: 'grid', gap: '0.5rem' }}>
            <Button variant="fill" color="primary" size="medium" onPress={closePopover}>
              Button1
            </Button>
            <Button variant="fill" color="primary" size="medium" onPress={closePopover}>
              Button2
            </Button>
          </div>
        )}
      </Popover>
    );
  },
};
