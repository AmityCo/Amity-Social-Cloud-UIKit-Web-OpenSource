import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneUser from '~/mock/useOneUser';

import UserFeedPage from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKUserFeedPage = {
  render: () => {
    const [props] = useArgs();
    const user = useOneUser();
    if (!user)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    return <UserFeedPage userId={user.userId} {...props} />;
  },

  name: 'User Profile Page',

  args: {},
  argTypes: {},
};
