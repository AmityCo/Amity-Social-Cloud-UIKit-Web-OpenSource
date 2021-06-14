import React from 'react';

import StyledCategoryHeader from './styles';

export default {
  title: 'Ui Only/Social/Category',
};

export const UiCategoryHeader = props => {
  const { clickable, ...args } = props;
  if (!clickable) delete args.onClick;
  return <StyledCategoryHeader {...args} />;
};

UiCategoryHeader.storyName = 'Header';

UiCategoryHeader.args = {
  categoryId: 'Web-Test',
  name: 'Web-Test',
  avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
  clickable: false,
  children: 'children slot',
  loading: false,
};

UiCategoryHeader.argTypes = {
  categoryId: { control: { type: 'text' } },
  name: { control: { type: 'text' } },
  avatarFileUrl: { control: { type: 'text' } },
  clickable: { control: { type: 'boolean' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
  loading: { control: { type: 'boolean' } },
};
