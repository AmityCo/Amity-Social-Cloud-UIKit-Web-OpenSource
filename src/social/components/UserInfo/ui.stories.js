import React from 'react';

import UserInfo from './UIUserInfo';

export default {
  title: 'Ui Only/Social/User',
};

export const UiUserInfo = props => <UserInfo {...props} />;

UiUserInfo.storyName = 'Information';

UiUserInfo.args = {
  userId: 'Web-Test',
  avatarFileId: '',
  displayName: '',
  description: '',
  isMyProfile: false,
  postsCount: 0,
};

UiUserInfo.argTypes = {
  userId: { control: { type: 'text' } },
  avatarFileId: { control: { type: 'text' } },
  displayName: { control: { type: 'text' } },
  description: { control: { type: 'text' } },
  isMyProfile: { control: { type: 'boolean' } },
  postsCount: { control: { type: 'number' } },
  editProfile: { action: 'editProfile(userId)' },
  goToChat: { action: 'goToChat(userId)' },
};
