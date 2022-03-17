import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneUser from '~/mock/useOneCommunity';

import UserFeedPage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKUserFeedPage = (props) => {
  const [user, isLoading] = useOneUser();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <UserFeedPage userId={user.userId} {...props} />;
};

SDKUserFeedPage.storyName = 'User Profile Page';
