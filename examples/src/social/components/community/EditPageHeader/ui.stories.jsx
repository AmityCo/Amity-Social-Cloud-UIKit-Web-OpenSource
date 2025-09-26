import React, { useState } from 'react';

import { PageTabs } from '~/social/pages/CommunityEdit/constants';
import EditPageHeader from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiEditPageHeader = {
  render: () => {
    const [props] = useArgs();
    const [activeTab, setActiveTab] = useState(PageTabs.EDIT_PROFILE);
    return <EditPageHeader {...props} activeTab={activeTab} setActiveTab={setActiveTab} />;
  },

  name: 'Edit Page Header',

  args: {
    communityName: 'Example Community Name',
    avatarFileUrl: 'https://via.placeholder.com/150x150',
    tabs: Object.values(PageTabs),
  },

  argTypes: {
    onReturnToCommunity: { action: 'onReturnToCommunity()' },
  },
};
