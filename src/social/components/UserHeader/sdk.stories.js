import React from 'react';

import UiKitUserHeader from '.';

export default {
  title: 'SDK Connected/Social/User',
};

export const SDKUserHeader = ({ userId, children, onClick, isBanned }) => (
  <UiKitUserHeader userId={userId} onClick={onClick} isBanned={isBanned}>
    {children}
  </UiKitUserHeader>
);

SDKUserHeader.storyName = 'Header';

SDKUserHeader.args = {
  userId: 'Web-Test',
  children: 'children slot',
  isBanned: false,
};

SDKUserHeader.argTypes = {
  userId: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  isBanned: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
};
