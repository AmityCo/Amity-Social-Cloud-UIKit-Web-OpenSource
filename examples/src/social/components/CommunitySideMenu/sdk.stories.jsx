import React from 'react';
import { Section } from '~/core/components/SideMenuSection/ui.stories';
import UiKitCommunitySideMenu from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitySideMenu = {
  render: () => {
    const [props] = useArgs();
    return <UiKitCommunitySideMenu {...props} />;
  },
  name: 'Side menu',

  args: {
    activeCommunity: '',
  },
};

Section.argTypes = {
  activeCommunity: { control: { type: 'text' } },
};
