import React from 'react';
import UiKitProvider from '../src/components/UiKitProvider';

const UiKitDecorator = storyFn => (
  <UiKitProvider
    apiKey={process.env.STORYBOOK_SDK_API_KEY}
    userId="Web-Test"
    displayName="Web-Test"
  >
    {storyFn()}
  </UiKitProvider>
);

export default UiKitDecorator;
