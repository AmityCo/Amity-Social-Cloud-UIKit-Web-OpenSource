import React from 'react';
import { useString } from '~/v4/core/localization';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoryPreview } from '.';

export default {
  title: 'v4/Social/Story Preview',
  component: StoryPreview,
} as ComponentMeta<typeof StoryPreview>;

const Template: ComponentStory<typeof StoryPreview> = (args) => (
  <div
    style={{
      width: '23.4375rem',
      height: '40.875rem',
    }}
  >
    <StoryPreview {...args} />
  </div>
);

export const ImageStory = Template.bind({});
ImageStory.args = {
  mediaType: { type: 'image', url: 'https://picsum.photos/400/400' },
  imageMode: 'fit',
  hyperLink: [],
  avatar: 'https://picsum.photos/120/120',
  title: 'John Doe',
  description: 'This is an image story',
};

export const StoryWithHyperlink = Template.bind({});
StoryWithHyperlink.args = {
  mediaType: {
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  hyperLink: [
    {
      data: {
        url: useString('amity_social_placeholder_hyperlink_url_hint'),
        customText: useString('amity_social_label_visit_website'),
      },
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ],
  avatar: 'https://picsum.photos/120/120',
  title: 'Sarah Johnson',
  description: 'This is a story with a hyperlink',
};
