import React, { useState } from 'react';

import { PageTabs } from '~/social/pages/CommunityEdit/constants';
import EditPageHeader from '.';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiEditPageHeader = args => {
  const [activeTab, setActiveTab] = useState(PageTabs.EDIT_PROFILE);
  return <EditPageHeader {...args} activeTab={activeTab} setActiveTab={setActiveTab} />;
};

UiEditPageHeader.storyName = 'Edit Page Header';

UiEditPageHeader.args = {
  communityName: 'Example Community Name',
  avatarFileUrl: 'https://via.placeholder.com/150x150',
  tabs: Object.values(PageTabs),
};

UiEditPageHeader.argTypes = {
  onReturnToCommunity: { action: 'onReturnToCommunity()' },
};
