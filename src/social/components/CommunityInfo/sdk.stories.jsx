import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityInfo from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityInfo = {
  render: () => {
    const [community, isLoading] = useOneCommunity();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    if (!community && isLoading === false) return <>No community found</>;

    return <UiKitCommunityInfo communityId={community.communityId} />;
  },

  name: 'Informations',
  args: {},
  argTypes: {},
};
