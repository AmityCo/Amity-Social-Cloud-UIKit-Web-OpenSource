import React, { useMemo } from 'react';
import NavigationProvider, { NavigationContext } from '~/social/providers/NavigationProvider';

import UiKitCommunitiesList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitiesList = {
  render: () => {
    const [{ querySearch, onlyShowJoined }] = useArgs();

    const queryParams = useMemo(() => {
      const queryParams = {};
      if (onlyShowJoined) {
        queryParams.filter = 'member';
      }

      if (querySearch) {
        queryParams.search = querySearch;
      }
      return queryParams;
    }, [querySearch, onlyShowJoined]);

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
  },

  name: 'Communities list',

  args: {
    querySearch: '',
    onlyShowJoined: false,
  },

  argTypes: {
    querySearch: { control: { type: 'text' } },
    onlyShowJoined: { control: { type: 'boolean' } },
  },
};
