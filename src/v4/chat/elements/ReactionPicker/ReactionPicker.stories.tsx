import type { Meta, StoryObj } from '@storybook/react';
import { ReactionPicker } from './ReactionPicker';

const meta: Meta<typeof ReactionPicker> = {
  component: ReactionPicker,
  title: 'v4/chat/elements/ReactionPicker',
  tags: ['autodocs'],
  argTypes: {
    myReaction: {
      control: 'select',
      options: [null, 'like', 'love', 'fire', 'happy', 'sad'],
    },
    position: {
      control: 'radio',
      options: ['above', 'below'],
    },
  },
  args: {
    myReaction: null,
    position: 'above',
    onReactionClick: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof ReactionPicker>;

export const Default: Story = {};

export const SelectedLike: Story = {
  args: { myReaction: 'like' },
};

export const SelectedLove: Story = {
  args: { myReaction: 'love' },
};

export const PositionBelow: Story = {
  args: { position: 'below' },
};
