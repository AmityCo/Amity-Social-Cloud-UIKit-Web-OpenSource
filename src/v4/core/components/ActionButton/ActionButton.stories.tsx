import { ActionButton } from './';
import React, { Fragment } from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { ArrowRight } from '~/v4/icons/ArrowRight';

const meta: Meta<typeof ActionButton> = {
  component: ActionButton,
  title: 'V4/Core/Components/ActionButton',
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
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['tiny', 'small', 'medium', 'large'],
      },
    },
    isDisabled: {
      control: 'boolean',
    },
    onPress: {
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Color: Story = {
  name: 'Color',
  render: (args) => (
    <Fragment>
      <ActionButton {...args} color="primary" size="large" icon={<ArrowRight />} />
      <ActionButton {...args} color="secondary" size="large" icon={<ArrowRight />} />
      <ActionButton {...args} color="tertiary" size="large" icon={<ArrowRight />} />
    </Fragment>
  ),
};

export const Size: Story = {
  name: 'Size',
  render: (args) => {
    const SIZES = ['tiny', 'small', 'medium', 'large'];
    return (
      <Fragment>
        {SIZES.map((size) => (
          <ActionButton
            {...args}
            key={size}
            color="primary"
            size={size as any}
            icon={<ArrowRight />}
          />
        ))}
      </Fragment>
    );
  },
};

export const State: Story = {
  name: 'State',
  render: (args) => (
    <Fragment>
      <ActionButton {...args} color="primary" size="large" icon={<ArrowRight />} isDisabled />
      <ActionButton {...args} color="secondary" size="large" icon={<ArrowRight />} isDisabled />
      <ActionButton {...args} color="tertiary" size="large" icon={<ArrowRight />} isDisabled />
    </Fragment>
  ),
};
