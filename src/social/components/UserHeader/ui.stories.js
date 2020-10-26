import React from 'react';

import StyledUserHeader from './styles';

export default {
  title: 'Ui Only/Social/User',
};

export const UiUserHeader = props => <StyledUserHeader {...props} />;

UiUserHeader.storyName = 'Header';

UiUserHeader.args = {
  userId: 'Web-Test',
  displayName: 'Web-Test',
  avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
  children: 'children slot',
};

UiUserHeader.argTypes = {
  userId: { control: { type: 'text' } },
  displayName: { control: { type: 'text' } },
  avatarFileUrl: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
};
