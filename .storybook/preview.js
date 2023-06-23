import '../src/styles/output.css';
import { FluidControl, UiKitDecorator } from './decorators';

const decorators = [FluidControl.decorator, UiKitDecorator.decorator];

// Get HTML head element
const head = document.getElementsByTagName('HEAD')[0];

// Create new link Element
const link = document.createElement('link');

// set the attributes for link element
link.rel = 'stylesheet';

link.type = 'text/css';

link.href = 'https://use.typekit.net/zzt4gto.css';

// Append link element to HTML head
head.appendChild(link);

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
