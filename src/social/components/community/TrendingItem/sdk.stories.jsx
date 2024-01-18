import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';
import TrendingItem from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SdkTrendingItem = {
  render: () => {
    const [props] = useArgs();
    const [community, isLoading] = useOneCommunity();
    if (isLoading || !community)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <TrendingItem communityId={community.communityId} {...props} />;
  },

  name: 'Trending Item',

  argTypes: {
    onClick: { action: 'onClick(communityId)' },
  },
};
