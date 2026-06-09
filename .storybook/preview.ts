import { Preview } from '@storybook/react';
import { FluidControl, UiKitDecorator, UiKitV4Decorator } from './decorators';

const preview: Preview = {
  args: {
    apiKey: undefined,
    apiRegion: undefined,
    userId: undefined,
    displayName: undefined,
    submit: false,
    syncNetworkConfig: false,
    visitorCanViewClip: false,
    authSignatureExpiresAt: new Date(),
    secureMode: false,
  },
  argTypes: {
    apiKey: { control: { type: 'text' } },
    apiRegion: { control: { type: 'text' } },
    userId: { control: { type: 'text' } },
    userType: {
      control: { type: 'select' },
      options: ['signed-in', 'visitor', 'bot'],
    },
    visitorCanViewClip: { control: { type: 'boolean' } },
    displayName: { control: { type: 'text' } },
    submit: { control: { type: 'boolean' } },
    syncNetworkConfig: { control: { type: 'boolean' } },
    authSignatureExpiresAt: {
      control: { type: 'date' },
      description: 'Authentication signature expiration date and time',
    },
    secureMode: { control: { type: 'boolean' } },
    theme: {
      options: ['default', 'light', 'dark'],
      control: {
        type: 'radio',
      },
    },
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
          'v4',
          [
            'social',
            ['pages', 'components', 'elements', 'internal-components'],
            'chat',
            ['pages', 'components', 'elements'],
            'live-chat',
            'assets',
            ['icons'],
          ],
          'V4',
          ['Core'],
          'V3',
          ['Social', 'Chat'],
        ],
      },
    },
  },
  globalTypes: {
    ...FluidControl.global,
  },
};

export default preview;
