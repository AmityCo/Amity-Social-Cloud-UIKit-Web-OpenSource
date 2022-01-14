import React from 'react';
import UiKitApp from '.';

export default {
  title: 'SDK Connected/Social',
};

export const SDKCommunityApp = (props) => <UiKitApp {...props} />;

SDKCommunityApp.storyName = 'Application';

SDKCommunityApp.args = {
  shouldHideExplore: false,
  socialCommunityCreationButtonVisible: true,
};

SDKCommunityApp.argTypes = {
  shouldHideExplore: { control: { type: 'boolean' } },
  socialCommunityCreationButtonVisible: { control: { type: 'boolean' } },
  onMemberClick: { action: 'onMemberClick()' },
};
