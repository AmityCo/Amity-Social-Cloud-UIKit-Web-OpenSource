import React from 'react';

import UiKitUserHeader from '.';

export default {
  title: 'SDK Connected/Social/User',
};

export const SDKUserHeader = ({ userId, children, onClick }) => (
  <UiKitUserHeader userId={userId} onClick={onClick}>
    {children}
  </UiKitUserHeader>
);

SDKUserHeader.storyName = 'Header';

SDKUserHeader.args = {
  userId: 'Web-Test',
  children: 'children slot',
};

SDKUserHeader.argTypes = {
  userId: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
};
