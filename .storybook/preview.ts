import { Preview } from '@storybook/react';
import { FluidControl, UiKitDecorator } from './decorators';

const preview: Preview = {
  decorators: [
    FluidControl.decorator,
    (Story, ctx) => {
      return UiKitDecorator.decorator(Story, ctx);
    },
  ],
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
