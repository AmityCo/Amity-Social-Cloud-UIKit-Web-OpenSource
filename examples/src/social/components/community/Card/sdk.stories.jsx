import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityCard from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityCard = {
  render: () => {
    const [community, isLoading] = useOneCommunity();
    if (isLoading || !community)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <UiKitCommunityCard communityId={community.communityId} />;
  },

  name: 'Card',
};
