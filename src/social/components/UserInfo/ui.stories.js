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
  isMe: false,
};

UiUserInfo.argTypes = {
  userId: { control: { type: 'text' } },
  avatarFileId: { control: { type: 'text' } },
  displayName: { control: { type: 'text' } },
  description: { control: { type: 'text' } },
  isMe: { control: { type: 'boolean' } },
};
