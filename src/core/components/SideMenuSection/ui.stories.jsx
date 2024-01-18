import React from 'react';

import UiKitSideMenuSection from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Side Menu',
};

export const Section = {
  render: () => {
    const [props] = useArgs();
    return <UiKitSideMenuSection {...props} />;
  },

  args: {
    heading: 'Section heading',
    children: 'children slot',
  },

  argTypes: {
    heading: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
};
