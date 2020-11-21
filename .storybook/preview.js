import React from 'react';
import { configure, addDecorator } from '@storybook/react';

import * as decorators from './decorators'

export const globalTypes = Object.values(decorators)
  .map(({ global }) => global)
  .reduce((obj, item) => ({ ...obj, ...item }), {})

Object.values(decorators)
  .map(({ decorator }) => decorator)
  .forEach(decorator => addDecorator(decorator))

export const parameters = {
  options: {
    storySort: {
      order: ['Journeys', 'Pages', 'Messaging', 'Social', 'Components', 'Assets'],
    },  
  },
};
