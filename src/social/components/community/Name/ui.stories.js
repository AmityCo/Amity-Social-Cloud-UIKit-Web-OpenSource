import React from 'react';

import StyledCommunityName from './UICommunityName';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityName = props => <StyledCommunityName {...props} />;

UiCommunityName.storyName = 'Name';

UiCommunityName.args = {
  name: 'Test Community',
  isOfficial: false,
  isPublic: true,
  isActive: false,
  isTitle: false,
};

UiCommunityName.argTypes = {
  name: { control: { type: 'text' } },
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  isActive: { control: { type: 'boolean' } },
  isTitle: { control: { type: 'boolean' } },
};
