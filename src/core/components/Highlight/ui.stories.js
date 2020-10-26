import React from 'react';

import UiKitHighlight from '.';

export default {
  title: 'Ui Only',
};

export const Highlight = ({ ...args }) => <UiKitHighlight {...args} />;

Highlight.args = {
  text: 'Some text with partial match',
  query: 'with partial',
};

Highlight.argTypes = {
  text: { control: { type: 'text' } },
  query: { control: { type: 'text' } },
};
