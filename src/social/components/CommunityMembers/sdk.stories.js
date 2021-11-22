import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';
import UiKitCommunityMembers from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityMembers = args => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <UiKitCommunityMembers communityId={community.communityId} {...args} />;
};

SDKCommunityMembers.storyName = 'Member List';
