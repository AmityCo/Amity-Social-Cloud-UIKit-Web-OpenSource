import React from 'react';

import UiKitUserHeader from './UserHeader.styles';
import UiKitUserHeaderWithSdk from '.';

export default {
  title: 'Components/User/Header',
  parameters: { layout: 'centered' },
};

export const UserHeader = props => <UiKitUserHeader {...props} />;

UserHeader.args = {
  userId: 'Web-Test',
  displayName: 'Web-Test',
  avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
  children: 'children slot',
};

UserHeader.argTypes = {
  userId: { control: { type: 'text' } },
  displayName: { control: { type: 'text' } },
  avatarFileUrl: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick' },
};

export const UserHeaderWithSdk = ({ userId, children, onClick }) => (
  <UiKitUserHeaderWithSdk userId={userId} onClick={onClick}>
    {children}
  </UiKitUserHeaderWithSdk>
);

UserHeaderWithSdk.args = {
  userId: 'Web-Test',
  children: 'children slot',
};

UserHeaderWithSdk.argTypes = {
  userId: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick' },
};
