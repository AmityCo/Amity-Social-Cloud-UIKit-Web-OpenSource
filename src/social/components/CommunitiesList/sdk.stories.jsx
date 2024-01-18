import React from 'react';
import { CommunityFilter } from '@amityco/js-sdk';
import NavigationProvider, { NavigationContext } from '~/social/providers/NavigationProvider';

import UiKitCommunitiesList from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitiesList = ({ communitiesQueryParam, querySearch, onlyShowJoined }) => {
  const queryParams = { ...communitiesQueryParam };

  if (onlyShowJoined) {
    queryParams.filter = CommunityFilter.Member;
  }

  if (querySearch) {
    queryParams.search = querySearch;
  }

  return (
    <NavigationProvider>
      <NavigationContext>
        {({ page }) => (
          <UiKitCommunitiesList
            communitiesQueryParam={queryParams}
            activeCommunity={page.communityId}
          />
        )}
      </NavigationContext>
    </NavigationProvider>
  );
};

SDKCommunitiesList.storyName = 'Communities list';

SDKCommunitiesList.args = {
  querySearch: '',
  onlyShowJoined: false,
};

SDKCommunitiesList.argTypes = {
  querySearch: { control: { type: 'text' } },
  onlyShowJoined: { control: { type: 'boolean' } },
};
