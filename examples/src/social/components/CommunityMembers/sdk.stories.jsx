import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';
import UiKitCommunityMembers from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityMembers = {
  render: () => {
    const [community, isLoading] = useOneCommunity();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (community == null) return;

    return <UiKitCommunityMembers communityId={community.communityId} />;
  },

  name: 'Member List',
  args: {},
  argTypes: {},
};
