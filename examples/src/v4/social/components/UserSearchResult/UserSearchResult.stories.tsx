import React from 'react';
import useOneUser from '~/mock/useOneUser';

import { UserSearchResult } from './UserSearchResult';

export default {
  title: 'v4-social/components/UserSearchResult',
};

export const UserSearchResultStory = {
  render: () => {
    const user = useOneUser();

    if (user == null) return null;

    return <UserSearchResult userCollection={[user]} onLoadMore={() => {}} />;
  },

  name: 'UserSearchResult',
};
