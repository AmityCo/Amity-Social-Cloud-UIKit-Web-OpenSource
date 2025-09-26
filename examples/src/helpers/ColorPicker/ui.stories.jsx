import React from 'react';
import defaultTheme from '~/core/providers/UiKitProvider/theme/default-theme';
import ColorPicker from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Utilities/Color Picker',
};

export const Default = {
  render: () => {
    const [props] = useArgs();
    return (
      <div style={{ height: '100vh' }}>
        <h2 style={{ marginBottom: 50 }}>
          Pick a main color and see how the shades of it will vary
        </h2>
        <ColorPicker {...props} />
      </div>
    );
  },

  args: {
    mainColor: '#1054DE',
  },

  argTypes: {
    mainColor: {
      control: {
        type: 'color',
      },
    },
  },
};

const { palette: defaultPalette } = defaultTheme;

export const AllColors = {
  render: () => {
    const [props] = useArgs();
    return (
      <div>
        {Object.keys(props).map((colorKey) => (
          <div key={colorKey} style={{ marginBottom: 30 }}>
            <h3>{colorKey}</h3>
            <ColorPicker mainColor={props[colorKey]} />
          </div>
        ))}
      </div>
    );
  },

  args: { ...defaultPalette },

  argTypes: {
    ...getArgTypes(),
  },
};

const getArgTypes = () => {
  return Object.keys(defaultPalette).reduce((acc, colorKey) => {
    acc[colorKey] = {
      control: { type: 'color' },
    };
    return acc;
  }, {});
};
