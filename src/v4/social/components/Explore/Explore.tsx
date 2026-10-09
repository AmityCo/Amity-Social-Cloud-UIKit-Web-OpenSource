import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { ExploreProvider } from '~/v4/social/providers/ExploreProvider';
import { Explore as ExploreComponent } from './ExploreComponent';

type ExploreProps = {
  pageId?: string;
};

export const Explore = ({ pageId = '*' }: ExploreProps) => {
  const componentId = COMPONENT_ID.EXPLORE_COMPONENT;
  const { isExcluded } = useAmityComponent({ pageId, componentId });

  // Gated out here rather than one level down, so `ExploreProvider` is never
  // mounted: the provider is what fetches the recommended and trending
  // communities, and a gate below it would have hidden the surface while still
  // asking the network for what to put in it.
  //
  // Discovery owns the titles and the empty state inside Explore, but the
  // categories and the community lists belong to Community — so with Discovery
  // off and this gate absent the tab stayed, the lists stayed, and only the
  // headings went. A list of communities with no heading is not a smaller
  // Explore; it is an Explore nobody can read.
  if (isExcluded) return null;

  return (
    <ExploreProvider>
      <ExploreComponent pageId={pageId} />
    </ExploreProvider>
  );
};
