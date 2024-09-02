import { Preview } from '@storybook/react';
import { FluidControl, UiKitDecorator, UiKitV4Decorator } from './decorators';

const preview: Preview = {
  args: {
    apiKey: undefined,
    apiRegion: undefined,
    userId: undefined,
    displayName: undefined,
    submit: false,
  },
  argTypes: {
    apiKey: { control: { type: 'text' } },
    apiRegion: { control: { type: 'text' } },
    userId: { control: { type: 'text' } },
    displayName: { control: { type: 'text' } },
    submit: { control: { type: 'boolean' } },
  },
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
  },
};

export default preview;
