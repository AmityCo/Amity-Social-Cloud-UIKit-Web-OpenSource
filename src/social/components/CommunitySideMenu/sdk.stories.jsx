import React from 'react';
import { Section } from '~/core/components/SideMenuSection/ui.stories';
import UiKitCommunitySideMenu from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitySideMenu = ({ ...args }) => <UiKitCommunitySideMenu {...args} />;

SDKCommunitySideMenu.storyName = 'Side menu';

SDKCommunitySideMenu.args = {
  activeCommunity: '',
};

Section.argTypes = {
  activeCommunity: { control: { type: 'text' } },
};
