import React, { useState } from 'react';
import { useArgs } from '@storybook/client-api';

import StyledRadios from '.';

export default {
  title: 'Ui Only/Radio',
};

export const UiRadio = () => {
  const [{ value, items, onChange }, updateArgs] = useArgs();

  const setValue = newVal => {
    onChange(newVal);
    updateArgs({ value: newVal });
  };

  return <StyledRadios value={value} items={items} onChange={setValue} />;
};

UiRadio.storyName = 'Simple radio';

UiRadio.args = {
  value: 'foo',
  items: [
    { value: 'foo', label: 'foo label' },
    { value: 'bar', label: 'bar label' },
  ],
};

UiRadio.argTypes = {
  value: { control: { type: 'text' } },
  items: { control: { type: 'object' } },
  onChange: { action: 'onChange()' },
};

export const CustomRadio = () => {
  const ItemRenderer = ({ label, value: color }) => (
    <div style={{ height: '3rem', color }}>{label}</div>
  );

  const items = [
    { value: 'red', label: '1st color', customRender: ItemRenderer },
    { value: 'blue', label: '2nd color', customRender: ItemRenderer },
  ];

  const [value, setValue] = useState(items[0].value);

  return <StyledRadios value={value} items={items} onChange={setValue} />;
};

CustomRadio.storyName = 'Custom renderer';

export const BooleanRadio = () => {
  const ItemRenderer = ({ label, value }) => (
    <div style={{ color: value ? 'green' : 'red' }}>{label}</div>
  );

  const items = [
    { value: true, label: 'true value', customRender: ItemRenderer },
    { value: false, label: 'false value', customRender: ItemRenderer },
  ];

  const [bool, setBool] = useState(items[0].value);

  return <StyledRadios value={bool} items={items} onChange={setBool} />;
};

BooleanRadio.storyName = 'Boolean renderer';
