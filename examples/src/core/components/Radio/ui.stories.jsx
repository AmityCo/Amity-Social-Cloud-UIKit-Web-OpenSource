import React, { useState } from 'react';
import { useArgs } from '@storybook/client-api';

import StyledRadios from '.';

export default {
  title: 'Ui Only/Radio',
};

export const UiRadio = {
  render: () => {
    const [{ value, items, onChange }, updateArgs] = useArgs();

    const setValue = (newVal) => {
      onChange(newVal);
      updateArgs({ value: newVal });
    };

    return <StyledRadios value={value} items={items} onChange={setValue} />;
  },

  name: 'Simple radio',

  args: {
    value: 'foo',
    items: [
      { value: 'foo', label: 'foo label' },
      { value: 'bar', label: 'bar label' },
    ],
  },

  argTypes: {
    value: { control: { type: 'text' } },
    items: { control: { type: 'object' } },
    onChange: { action: 'onChange()' },
  },
};

const RadioItemRenderer = ({ label, value: color }) => (
  <div style={{ height: '3rem', color }}>{label}</div>
);

export const CustomRadio = {
  render: () => {
    const items = [
      { value: 'red', label: '1st color', customRender: RadioItemRenderer },
      { value: 'blue', label: '2nd color', customRender: RadioItemRenderer },
    ];

    const [value, setValue] = useState(items[0].value);

    return <StyledRadios value={value} items={items} onChange={setValue} />;
  },

  name: 'Custom renderer',
};

const BooleanItemRenderer = ({ label, value }) => (
  <div style={{ color: value ? 'green' : 'red' }}>{label}</div>
);

export const BooleanRadio = {
  render: () => {
    const items = [
      { value: true, label: 'true value', customRender: BooleanItemRenderer },
      { value: false, label: 'false value', customRender: BooleanItemRenderer },
    ];

    const [bool, setBool] = useState(items[0].value);

    return <StyledRadios value={bool} items={items} onChange={setBool} />;
  },

  name: 'Boolean renderer',
};
