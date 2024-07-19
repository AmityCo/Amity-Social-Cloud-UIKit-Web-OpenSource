import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoryPreviewThumbnail } from './StoryPreviewThumbnail';

export default {
  title: 'v4/Social/Story Preview Thumbnail',
  component: StoryPreviewThumbnail,
} as ComponentMeta<typeof StoryPreviewThumbnail>;

const Template: ComponentStory<typeof StoryPreviewThumbnail> = (args) => (
  <StoryPreviewThumbnail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  thumbnailUrl: 'https://picsum.photos/400/600',
  hyperLink: [
    {
      data: {
        url: 'https://example.com',
        customText: 'Visit our website',
      },
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ],
  avatar: 'https://picsum.photos/400/600',
  title: 'John Doe',
  isOfficial: true,
  imageMode: 'fit',
};

export const LongTitle = Template.bind({});
LongTitle.args = {
  thumbnailUrl: 'https://picsum.photos/400/600',
  hyperLink: [
    {
      data: {
        url: 'https://example.com',
        customText: 'Visit our website',
      },
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ],
  avatar: 'https://picsum.photos/400/600',
  title: 'John Doe with a very long name that exceeds the available space',
  isOfficial: true,
};

export const NoHyperlink = Template.bind({});
NoHyperlink.args = {
  thumbnailUrl: 'https://picsum.photos/400/600',
  hyperLink: [],
  avatar: 'https://picsum.photos/400/600',
  title: 'John Doe',
  isOfficial: false,
};
