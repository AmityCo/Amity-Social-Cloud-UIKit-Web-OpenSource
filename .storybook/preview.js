import React from 'react';
import { configure, addDecorator } from '@storybook/react';

import { FluidControl, UiKitDecorator } from './decorators';

export const globalTypes = [FluidControl, UiKitDecorator]
  .map(({ global }) => global)
  .reduce((obj, item) => ({ ...obj, ...item }), {});

addDecorator(FluidControl.decorator);
addDecorator(UiKitDecorator.decorator);

export const parameters = {
  options: {
    storySort: {
      order: [
        'Ui Only',
        ['Social', 'Chat'],
        'SDK Connected',
        ['Social', 'Chat'],
        'Utilities',
        'Assets',
      ],
    },
  },
};
