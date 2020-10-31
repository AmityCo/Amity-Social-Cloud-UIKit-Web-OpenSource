import React from 'react';

import StyledCategoryHeader from './styles';

export default {
  title: 'Ui Only/Social/Category',
};

export const UiCategoryHeader = props => <StyledCategoryHeader {...props} />;

UiCategoryHeader.storyName = 'Header';

UiCategoryHeader.args = {
  categoryId: 'Web-Test',
  name: 'Web-Test',
  avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
  children: 'children slot',
};

UiCategoryHeader.argTypes = {
  categoryId: { control: { type: 'text' } },
  name: { control: { type: 'text' } },
  avatarFileUrl: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
};
