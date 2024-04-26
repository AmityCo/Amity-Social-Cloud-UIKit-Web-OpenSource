import { Preview } from '@storybook/react';
import { FluidControl, UiKitDecorator, UiKitV4Decorator } from './decorators';

const preview: Preview = {
  decorators: [
    FluidControl.decorator,
    (Story, ctx) => {
      if (ctx.componentId.toLocaleLowerCase().includes('v4')) {
        return UiKitV4Decorator.decorator(Story, ctx);
      }
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
          'V4',
          ['Chat'],
        ],
      },
    },
  },
  globalTypes: {
    ...FluidControl.global,
    ...UiKitDecorator.global,
    ...UiKitV4Decorator.global,
  },
};

export default preview;
