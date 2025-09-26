import React from 'react';
import { ExploreProvider } from '~/v4/social/providers/ExploreProvider';
import { Explore as ExploreComponent } from './ExploreComponent';

type ExploreProps = {
  pageId?: string;
};

export const Explore = ({ pageId = '*' }: ExploreProps) => {
  return (
    <ExploreProvider>
      <ExploreComponent pageId={pageId} />
    </ExploreProvider>
  );
};
