import React from 'react';

import StyledUserProfileBar from './UIUserProfileBar';

export default {
  title: 'Ui Only/Social/User',
};

export const UiUserProfileBar = props => <StyledUserProfileBar {...props} />;

UiUserProfileBar.storyName = 'Profile';

UiUserProfileBar.args = {
  userId: 'Web-Test',
  avatarFileId: '',
  displayName: '',
  description: '',
  isMyProfile: false,
  postsCount: 0,
};

UiUserProfileBar.argTypes = {
  userId: { control: { type: 'text' } },
  avatarFileId: { control: { type: 'text' } },
  displayName: { control: { type: 'text' } },
  description: { control: { type: 'text' } },
  isMyProfile: { control: { type: 'boolean' } },
  postsCount: { control: { type: 'number' } },
  editProfile: { action: 'editProfile(userId)' },
  goToChat: { action: 'goToChat(userId)' },
};
