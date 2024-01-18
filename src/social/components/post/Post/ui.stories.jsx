import React from 'react';
import UnknownPostRenderer from './UnknownPostRenderer';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Post',
};

export const UIUnknownPostRenderer = {
  render: () => {
    const [props] = useArgs();
    return <UnknownPostRenderer {...props} />;
  },
  name: 'UnknownPostRenderer',
};
