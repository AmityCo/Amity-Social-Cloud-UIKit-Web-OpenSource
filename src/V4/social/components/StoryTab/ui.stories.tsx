import React from 'react';
import StoryTab from '.';
import StoryRing from './StoryRing';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const UiStoryTab = {
  render: () => {
    return <StoryTab />;
  },
  name: 'Story Tab',
};

export const UiStoryRing = {
  render: () => {
    const [{ uploading }] = useArgs();
    return <StoryRing uploading={uploading} />;
  },
  name: 'Story Ring',
  args: {
    uploading: false,
  },
  argTypes: {
    uploading: { control: 'boolean' },
  },
};
