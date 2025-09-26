import { Button } from '.';
import { Plus } from '~/icons';
import React, { Fragment } from 'react';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'V4/Core/Components/Button',
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
    variant: {
      control: {
        type: 'select',
        options: ['fill', 'outlined'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
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

type Story = StoryObj<typeof Button>;

export const Variant: Story = {
  name: 'Variant',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium">
        Button
      </Button>
      <Button {...args} variant="text" color="primary" size="medium">
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="medium">
        Button
      </Button>
    </Fragment>
  ),
};

export const Color: Story = {
  name: 'Color',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium">
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="medium">
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="medium">
        Button
      </Button>
    </Fragment>
  ),
};

export const Size: Story = {
  name: 'Size',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium">
        Button
      </Button>
      <Button {...args} variant="fill" color="primary" size="small">
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="medium">
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="small">
        Button
      </Button>
      <Button {...args} variant="text" color="primary" size="small">
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="medium">
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="small">
        Button
      </Button>
    </Fragment>
  ),
};

export const State: Story = {
  name: 'State',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium" isDisabled>
        Button
      </Button>
      <Button {...args} variant="fill" color="primary" size="small" isDisabled>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="medium" isDisabled>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="small" isDisabled>
        Button
      </Button>
      <Button {...args} variant="text" color="primary" size="medium" isDisabled>
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="medium" isDisabled>
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="small" isDisabled>
        Button
      </Button>
    </Fragment>
  ),
};

export const WithIcon: Story = {
  name: 'WithIcon',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium" icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="primary" size="medium" isDisabled icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="primary" size="small" icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="primary" size="small" isDisabled icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="medium" icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="medium" isDisabled icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="small" icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="fill" color="alert" size="small" isDisabled icon={<Plus />}>
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="medium" icon={<Plus />}>
        Button
      </Button>
      <Button
        {...args}
        isDisabled
        size="medium"
        icon={<Plus />}
        color="secondary"
        variant="outlined"
      >
        Button
      </Button>
      <Button {...args} variant="outlined" color="secondary" size="small" icon={<Plus />}>
        Button
      </Button>
      <Button
        {...args}
        isDisabled
        size="small"
        icon={<Plus />}
        color="secondary"
        variant="outlined"
      >
        Button
      </Button>
    </Fragment>
  ),
};

export const Icon: Story = {
  name: 'Icon',
  render: (args) => (
    <Fragment>
      <Button {...args} variant="fill" color="primary" size="medium" icon={<Plus />} />
      <Button {...args} variant="fill" color="primary" size="medium" icon={<Plus />} isDisabled />
      <Button {...args} variant="fill" color="primary" size="small" icon={<Plus />} />
      <Button {...args} variant="fill" color="primary" size="small" icon={<Plus />} isDisabled />
      <Button {...args} variant="fill" color="alert" size="medium" icon={<Plus />} />
      <Button {...args} variant="fill" color="alert" size="medium" icon={<Plus />} isDisabled />
      <Button {...args} variant="fill" color="alert" size="small" icon={<Plus />} />
      <Button {...args} variant="fill" color="alert" size="small" icon={<Plus />} isDisabled />
      <Button {...args} variant="outlined" color="secondary" size="medium" icon={<Plus />} />
      <Button
        {...args}
        variant="outlined"
        color="secondary"
        size="medium"
        icon={<Plus />}
        isDisabled
      />
      <Button {...args} variant="outlined" color="secondary" size="small" icon={<Plus />} />
      <Button
        {...args}
        variant="outlined"
        color="secondary"
        size="small"
        icon={<Plus />}
        isDisabled
      />
    </Fragment>
  ),
};
