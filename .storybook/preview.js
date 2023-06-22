import '../src/styles/output.css';
import { FluidControl, UiKitDecorator } from './decorators';

const decorators = [FluidControl.decorator, UiKitDecorator.decorator];

const parameters = {
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

const globalTypes = {
  ...FluidControl.global,
  ...UiKitDecorator.global,
};

export { decorators, globalTypes, parameters };
