import React from 'react';
import UiKitProvider from '../src/components/UiKitProvider';

const UiKitDecorator = (storyFn) => (
  <UiKitProvider
    clientOptions={{ apiKey: 'b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b' }}
    theme={{}}
  >
    {storyFn()}
  </UiKitProvider>
);

export default UiKitDecorator;
