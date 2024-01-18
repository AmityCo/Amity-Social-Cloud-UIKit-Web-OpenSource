import React from 'react';

import UICategoryHeader from './UICategoryHeader';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Category',
};

export const UiCategoryHeader = {
  render: () => {
    const [props] = useArgs();
    const { clickable, ...args } = props;
    if (!clickable) delete args.onClick;
    return <UICategoryHeader {...args} />;
  },

  name: 'Header',

  args: {
    categoryId: 'Web-Test',
    name: 'Web-Test',
    avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
    clickable: false,
    children: 'children slot',
    loading: false,
  },

  argTypes: {
    categoryId: { control: { type: 'text' } },
    name: { control: { type: 'text' } },
    avatarFileUrl: { control: { type: 'text' } },
    clickable: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    onClick: { action: 'onClick()' },
    loading: { control: { type: 'boolean' } },
  },
};
