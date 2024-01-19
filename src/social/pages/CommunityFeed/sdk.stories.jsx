import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import CommunityProfilePage from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityProfilePage = {
  render: () => {
    const [props] = useArgs();
    const [community, isLoading] = useOneCommunity();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (community == null) return null;
    return <CommunityProfilePage communityId={community.communityId} {...props} />;
  },

  name: 'Community Profile Page',
};
