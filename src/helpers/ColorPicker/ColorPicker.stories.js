import React from 'react';
import defaultTheme from '~/core/providers/UiKitProvider/theme/default-theme';
import ColorPicker from '.';

export default {
  title: 'Utilities/Color Picker',
  parameters: { layout: 'centered' },
};

export const Default = args => {
  return (
    <div style={{ height: '100vh' }}>
      <h2 style={{ marginBottom: 50 }}>Pick a main color and see how the shades of it will vary</h2>
      <ColorPicker {...args} />
    </div>
  );
};

Default.args = {
  mainColor: '#1054DE',
};

Default.argTypes = {
  mainColor: {
    control: {
      type: 'color',
    },
  },
};

const { palette: defaultPalette } = defaultTheme;

export const AllColors = args => {
  return (
    <div>
      {Object.keys(args).map(colorKey => (
        <div key={colorKey} style={{ marginBottom: 30 }}>
          <h3>{colorKey}</h3>
          <ColorPicker mainColor={args[colorKey]} />
        </div>
      ))}
    </div>
  );
};

AllColors.args = { ...defaultPalette };

const getArgTypes = () => {
  return Object.keys(defaultPalette).reduce((acc, colorKey) => {
    acc[colorKey] = {
      control: { type: 'color' },
    };
    return acc;
  }, {});
};

AllColors.argTypes = {
  ...getArgTypes(),
};
