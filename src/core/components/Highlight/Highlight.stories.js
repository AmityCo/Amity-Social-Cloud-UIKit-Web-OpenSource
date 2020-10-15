import React from 'react';
import Highlight from '.';

export default {
  title: 'Components/Highlight',
  parameters: { layout: 'centered' },
};

export const Basic = ({ ...args }) => <Highlight {...args} />;

Basic.args = {
  text: 'Some text with partial match',
  query: 'with partial',
};

Basic.argTypes = {
  text: { control: { type: 'text' } },
  query: { control: { type: 'text' } },
};
