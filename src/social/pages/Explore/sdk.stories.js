import React from 'react';
import ExplorePage from '.';

export default {
  title: 'Sdk connected/Social/Pages',
};

export const SdkExplorePage = props => (
  <div style={{ maxWidth: '930px' }}>
    <ExplorePage {...props} />
  </div>
);

SdkExplorePage.storyName = 'Explore';
