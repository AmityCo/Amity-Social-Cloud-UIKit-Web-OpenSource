import React from 'react';
import ExplorePage from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Sdk connected/Social/Pages',
};

export const SdkExplorePage = {
  render: () => {
    const [props] = useArgs();
    return (
      <div style={{ maxWidth: '930px' }}>
        <ExplorePage {...props} />
      </div>
    );
  },

  name: 'Explore',
};
