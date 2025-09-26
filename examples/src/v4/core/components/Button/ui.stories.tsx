import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from './Button';
import { ArrowRight2Icon } from '~/icons';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Variant: ComponentStory<typeof Button> = (args) => (
  <>
    <Button {...args} variant="primary">
      Primary
    </Button>
    <Button {...args} variant="secondary">
      Secondary
    </Button>
  </>
);

export const Size: ComponentStory<typeof Button> = (args) => (
  <>
    <Button {...args} size="small">
      Small
    </Button>
    <Button {...args} size="medium">
      Medium
    </Button>
    <Button {...args} size="large">
      Large
    </Button>
  </>
);

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: 'Disabled Button',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: <ArrowRight2Icon />,
};
