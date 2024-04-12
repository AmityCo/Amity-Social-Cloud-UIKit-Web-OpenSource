import { Preview } from '@storybook/react';
import { FluidControl, UiKitDecorator } from './decorators';

const preview: Preview = {
  decorators: [FluidControl.decorator, UiKitDecorator.decorator],
  parameters: {
    options: {
      storySort: {
        order: [
          'Ui Only',
          ['Social', 'Chat'],
          'SDK Connected',
          ['Social', 'Chat'],
          'Utilities',
          'Assets',
          'V4',
          ['Chat'],
        ],
      },
    },
  },
  globalTypes: {
    ...FluidControl.global,
    ...UiKitDecorator.global,
  },
};

export default preview;
